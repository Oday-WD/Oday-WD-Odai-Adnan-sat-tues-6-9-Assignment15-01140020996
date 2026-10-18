import { Button, Spinner, TextArea } from "@heroui/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../context/AuthProvider";
import { createPost } from "../../../service/Post.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import {
  postSchema,
  POST_BODY_MAX_LENGTH,
  type PostFormSchema,
} from "../../../schema/Post";
import { privacyConfig } from "../../../utils/privacyConfig";
import { EmojiPickerButton } from "../../Shared/EmojiPickerButton/EmojiPickerButton";

export const PostForm = () => {
  const queryClient = useQueryClient();
  const { token, currentUser } = useAuth();
  const [previewImage, setPreviewImage] = useState<string>("");
  const postImgRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    trigger,
    reset,
    formState: { isValid },
  } = useForm<PostFormSchema>({
    defaultValues: { body: "", image: null, privacy: "public" },
    resolver: zodResolver(postSchema),
    mode: "onChange",
  });

  const { ref: bodyFormRef, ...bodyRegister } = register("body");
  const selectedPrivacy = watch("privacy");

  function onClickPhotoHandler() {
    postImgRef.current?.click();
  }
  function onChangePhotoHandler() {
    const file = postImgRef.current?.files?.[0] ?? null;
    setValue("image", file);
    trigger("body");
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  }
  function onRemovePhotoHandler() {
    URL.revokeObjectURL(previewImage);
    setPreviewImage("");
    if (postImgRef.current) postImgRef.current.value = "";
    setValue("image", null);
    trigger("body");
  }
  function resetPostHandler() {
    URL.revokeObjectURL(previewImage);
    setPreviewImage("");
    if (postImgRef.current) postImgRef.current.value = "";
    reset();
  }
  function onEmojiSelectHandler(emoji: string) {
    const textarea = bodyRef.current;
    const current = getValues("body") ?? "";
    const start = textarea?.selectionStart ?? current.length;
    const end = textarea?.selectionEnd ?? current.length;
    const newValue = current.slice(0, start) + emoji + current.slice(end);

    if (newValue.length > POST_BODY_MAX_LENGTH) return;

    setValue("body", newValue, { shouldValidate: true, shouldDirty: true });

    requestAnimationFrame(() => {
      const position = start + emoji.length;
      textarea?.focus();
      textarea?.setSelectionRange(position, position);
    });
  }
  async function createPostRequest(data: PostFormSchema) {
    const postForm = new FormData();

    if (data.body) {
      postForm.append("body", data.body);
    }

    if (data.image) {
      postForm.append("image", data.image);
    }

    if (data.privacy) {
      postForm.append("privacy", data.privacy);
    }

    return await createPost(token, postForm);
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createPostRequest,
    onSuccess: function (data) {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      toast.success(data?.data?.message ?? "Post created successfully");
      resetPostHandler();
    },
    onError: function (error) {
      toast.error(
        isAxiosError(error) ? error.response?.data.message : error.message,
      );
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {/* Profile + Privacy selector */}
          <div className="mb-3 flex items-start gap-3">
            <img
              alt={currentUser?.name}
              className="h-11 w-11 rounded-full object-cover"
              src={currentUser?.photo}
            />
            <div className="flex-1">
              <p className="text-base font-extrabold text-slate-900">
                {currentUser?.name}
              </p>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                <i
                  className={`${privacyConfig[selectedPrivacy].icon} text-[12px]`}
                ></i>
                <select
                  {...register("privacy")}
                  className="bg-transparent outline-none"
                >
                  <option value="public">Public</option>
                  <option value="following">Followers</option>
                  <option value="only_me">Only me</option>
                </select>
              </div>
            </div>
          </div>

          {/* Text Area*/}
          <div className="relative">
            <TextArea
              {...bodyRegister}
              ref={(element: HTMLTextAreaElement | null) => {
                bodyFormRef(element);
                bodyRef.current = element;
              }}
              rows={4}
              maxLength={POST_BODY_MAX_LENGTH}
              placeholder={`What's on your mind, ${currentUser?.name.split(" ")[0]}?`}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[17px] leading-relaxed text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
            />
          </div>
          
          {/* Preview Image */}
          {previewImage && (
            <div className="relative mt-2">
              <img
                alt="Preview"
                className="max-h-60 w-full rounded-lg object-cover"
                src={previewImage}
              />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-black/60 py-1 px-1.5 text-white backdrop-blur-sm  cursor-pointer"
                onClick={onRemovePhotoHandler}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {/* Actions row */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <div className="relative flex items-center gap-2">
              <input
                accept="image/*"
                className="hidden"
                type="file"
                ref={postImgRef}
                onChange={onChangePhotoHandler}
              />
              <label
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                onClick={onClickPhotoHandler}
              >
                <i className="fa-regular fa-image text-emerald-600"></i>
                <span className="hidden sm:inline">Photo/video</span>
              </label>

              {/* emoji Button */}
              <EmojiPickerButton
                onEmojiSelect={onEmojiSelectHandler}
                buttonClassName="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                <i className="fa-regular fa-face-smile text-amber-500"></i>
                <span className="hidden sm:inline">Feeling/activity</span>
              </EmojiPickerButton>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                isDisabled={!isValid}
                className="flex items-center gap-2 rounded-lg bg-[#1877f2] px-5 py-2 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#166fe5] disabled:opacity-60"
              >
                {isPending ? (
                  <Spinner />
                ) : (
                  <>
                    <span>Post</span>
                    <i className="fa-solid fa-paper-plane text-base"></i>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
