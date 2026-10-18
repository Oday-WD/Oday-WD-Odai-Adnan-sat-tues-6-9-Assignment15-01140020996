import { Button, Spinner } from "@heroui/react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuth } from "../../context/AuthProvider";
import { updatePostComment } from "../../service/comment.service";
import type { Comment } from "../../interfaces/comment";
import {
  createCommentEditSchema,
  COMMENT_MAX_LENGTH,
  type CommentEditFormSchema,
} from "../../schema/Comment";

interface CommentEditFormProps {
  comment: Comment;
  postId: string;
  onClose: () => void;
}

export const CommentEditForm = ({
  comment,
  postId,
  onClose,
}: CommentEditFormProps) => {
  const { _id: commentId, content, image } = comment;
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string>("");
  const imgRef = useRef<HTMLInputElement | null>(null);

  const editSchema = useMemo(
    () => createCommentEditSchema(Boolean(image)),
    [image],
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<CommentEditFormSchema>({
    defaultValues: { content: content ?? "", image: null },
    resolver: zodResolver(editSchema),
    mode: "onChange",
  });

  const displayedImage = previewImage || image;

  function onClickPhotoHandler() {
    imgRef.current?.click();
  }

  function onChangePhotoHandler() {
    const file = imgRef.current?.files?.[0] ?? null;
    if (!file) return;
    if (previewImage) URL.revokeObjectURL(previewImage);
    setValue("image", file, { shouldValidate: true, shouldDirty: true });
    setPreviewImage(URL.createObjectURL(file));
  }

  function onRemovePhotoHandler() {
    URL.revokeObjectURL(previewImage);
    setPreviewImage("");
    if (imgRef.current) imgRef.current.value = "";
    setValue("image", null, { shouldValidate: true, shouldDirty: true });
  }

  function closeHandler() {
    if (previewImage) URL.revokeObjectURL(previewImage);
    onClose();
  }

  // Update function
  const { mutate, isPending } = useMutation({
    mutationFn: (data: CommentEditFormSchema) => {
      const commentForm = new FormData();
      commentForm.append("content", data.content);
      if (data.image) {
        commentForm.append("image", data.image);
      }
      return updatePostComment(token, postId, commentId, commentForm);
    },
    onSuccess: function (data) {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["PostComments", postId] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["singlePosts", postId] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      closeHandler();
    },
    onError: function (error) {
      toast.error(
        isAxiosError(error) ? error.response?.data.message : error.message,
      );
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))} className="mt-1">
      {/* Text Area */}
      <textarea
        {...register("content")}
        autoFocus
        maxLength={COMMENT_MAX_LENGTH}
        className="min-h-27.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[#1877f2]/20 focus:border-[#1877f2] focus:ring-2"
      ></textarea>
      {errors.content && (
        <p className="mt-1 text-xs font-semibold text-rose-600">
          {errors.content.message}
        </p>
      )}

      {/* Image*/}
      {displayedImage && (
        <div className="relative mt-2">
          <img
            alt="Comment"
            className="max-h-52 w-full rounded-lg object-cover"
            src={displayedImage}
          />
          {previewImage && (
            <button
              type="button"
              onClick={onRemovePhotoHandler}
              className="absolute right-2 top-2 cursor-pointer rounded-full bg-black/60 px-1.5 py-1 text-white backdrop-blur-sm"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      )}

      {/* Actions row */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        {/* Change / Add photo */}
        <div className="flex items-center gap-2">
          <input
            accept="image/*"
            className="hidden"
            type="file"
            ref={imgRef}
            onChange={onChangePhotoHandler}
          />
          <label
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            onClick={onClickPhotoHandler}
          >
            <i className="fa-regular fa-image text-emerald-600"></i>
            <span>{image ? "Change photo" : "Add photo"}</span>
          </label>
        </div>

        {/* Cancel / Save */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={closeHandler}
            disabled={isPending}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            Cancel
          </button>
          <Button
            type="submit"
            isDisabled={!isValid || !isDirty || isPending}
            className="rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5] disabled:opacity-60"
          >
            {isPending ? <Spinner color="current" size="sm" /> : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
};
