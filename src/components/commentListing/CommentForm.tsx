import { Button, Spinner } from "@heroui/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuth } from "../../context/AuthProvider";
import { createPostComment } from "../../service/comment.service";
import {
  commentSchema,
  COMMENT_MAX_LENGTH,
  type CommentFormSchema,
} from "../../schema/Comment";
import { EmojiPickerButton } from "../Shared/EmojiPickerButton/EmojiPickerButton";

interface CommentFormProps {
  postId: string;
}

export const CommentForm = ({ postId }: CommentFormProps) => {
  const { token, currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [previewImage, setPreviewImage] = useState<string>("");
  const imgRef = useRef<HTMLInputElement | null>(null);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { isValid },
  } = useForm<CommentFormSchema>({
    defaultValues: { content: "", image: null },
    resolver: zodResolver(commentSchema),
    mode: "onChange",
  });

  const { ref: contentFormRef, ...contentRegister } = register("content");

  function onClickImageHandler() {
    imgRef.current?.click();
  }

  function onChangeImageHandler() {
    const file = imgRef.current?.files?.[0] ?? null;
    setValue("image", file);
    trigger("content");
    setPreviewImage(file ? URL.createObjectURL(file) : "");
  }

  function onRemoveImageHandler() {
    URL.revokeObjectURL(previewImage);
    setPreviewImage("");
    if (imgRef.current) imgRef.current.value = "";
    setValue("image", null);
    trigger("content");
  }

  function resetCommentHandler() {
    URL.revokeObjectURL(previewImage);
    setPreviewImage("");
    if (imgRef.current) imgRef.current.value = "";
    reset();
  }

  function onEmojiSelectHandler(emoji: string) {
    const textarea = contentRef.current;
    const current = getValues("content") ?? "";
    const start = textarea?.selectionStart ?? current.length;
    const end = textarea?.selectionEnd ?? current.length;
    const newValue = current.slice(0, start) + emoji + current.slice(end);

    if (newValue.length > COMMENT_MAX_LENGTH) return;

    setValue("content", newValue, { shouldValidate: true, shouldDirty: true });

    requestAnimationFrame(() => {
      const position = start + emoji.length;
      textarea?.focus();
      textarea?.setSelectionRange(position, position);
    });
  }

  async function createCommentRequest(data: CommentFormSchema) {
    const commentForm = new FormData();
    if (data.content) {
      commentForm.append("content", data.content);
    }
    if (data.image) {
      commentForm.append("image", data.image);
    }
    return await createPostComment(token, postId, commentForm);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createCommentRequest,
    onSuccess: function (data) {
      queryClient.invalidateQueries({ queryKey: ["PostComments", postId] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["singlePosts", postId] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(data.data.message);
      resetCommentHandler();
    },
    onError: function (error) {
      toast.error(
        isAxiosError(error) ? error.response?.data.message : error.message,
      );
    },
  });

  return (
    <>
      <div className="flex items-start gap-2">
        {/* Profile Photo*/}
        <img
          alt={currentUser?.name}
          className="h-9 w-9 rounded-full object-cover"
          src={currentUser?.photo}
        />

        <form
          onSubmit={handleSubmit((data) => mutate(data))}
          className="w-full rounded-2xl border border-slate-200 bg-[#f0f2f5] px-2.5 py-1.5 focus-within:border-[#c7dafc] focus-within:bg-white"
        >
          {/* Text Area */}
          <textarea
            {...contentRegister}
            ref={(element) => {
              contentFormRef(element);
              contentRef.current = element;
            }}
            placeholder={`Comment as ${currentUser?.name.split(" ")[0]}...`}
            rows={1}
            maxLength={COMMENT_MAX_LENGTH}
            className="max-h-35 min-h-10 w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-5 outline-none placeholder:text-slate-500"
          ></textarea>

          <div className="mt-1 flex items-center justify-between">
            {/* image input*/}
            <div className="flex items-center gap-1">
              <input
                accept="image/*"
                className="hidden"
                type="file"
                ref={imgRef}
                onChange={onChangeImageHandler}
              />
              <label
                className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-emerald-600"
                onClick={onClickImageHandler}
              >
                <i className="fa-regular fa-image text-base"></i>
              </label>

              {/* emoji Button */}
              <EmojiPickerButton
                onEmojiSelect={onEmojiSelectHandler}
                buttonClassName="inline-flex items-center justify-center rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-amber-500"
              >
                <i className="fa-regular fa-face-smile text-base"></i>
              </EmojiPickerButton>
            </div>

            {/* submit button*/}
            <Button
              type="submit"
              isDisabled={!isValid || isPending}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:bg-[#9ec5ff] disabled:opacity-100"
            >
              {isPending ? (
                <Spinner color="current" size="sm" />
              ) : (
                <i className="fa-solid fa-paper-plane"></i>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* previewImage */}
      {previewImage && (
        <div className="relative mt-2">
          <img
            alt="Comment preview"
            className="max-h-52 w-full rounded-lg object-cover"
            src={previewImage}
          />

          {/* Remove previewImage Button */}
          <button
            onClick={onRemoveImageHandler}
            type="button"
            className="absolute right-2 top-2 rounded-full bg-black/60 py-1 px-1.5 text-white backdrop-blur-sm  cursor-pointer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}
    </>
  );
};
