import { Button, Spinner } from "@heroui/react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuth } from "../../../context/AuthProvider";
import { updatePost } from "../../../service/Post.service";
import type { Post } from "../../../interfaces/post";
import { privacyConfig } from "../../../utils/privacyConfig";
import {
  createPostEditSchema,
  POST_BODY_MAX_LENGTH,
  type PostEditFormSchema,
} from "../../../schema/Post";

interface PostEditFormProps {
  post: Post;
  onClose: () => void;
}

export const PostEditForm = ({ post, onClose }: PostEditFormProps) => {
  const {
    _id: postId,
    body,
    image,
    privacy,
    user: { _id: userId },
  } = post;
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string>("");
  const imgRef = useRef<HTMLInputElement | null>(null);

  const editSchema = useMemo(
    () => createPostEditSchema(Boolean(image)),
    [image],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<PostEditFormSchema>({
    defaultValues: {
      body: body ?? "",
      image: null,
      removeImage: false,
      privacy,
    },
    resolver: zodResolver(editSchema),
    mode: "onChange",
  });

  const selectedPrivacy = watch("privacy");
  const isImageRemoved = watch("removeImage");
  const displayedImage = previewImage || (isImageRemoved ? "" : image);

  function onClickPhotoHandler() {
    imgRef.current?.click();
  }

  function onChangePhotoHandler() {
    const file = imgRef.current?.files?.[0] ?? null;
    if (!file) return;
    if (previewImage) URL.revokeObjectURL(previewImage);
    setValue("image", file, { shouldValidate: true, shouldDirty: true });
    setValue("removeImage", false, { shouldValidate: true, shouldDirty: true });
    setPreviewImage(URL.createObjectURL(file));
  }

  function onRemoveNewPhotoHandler() {
    URL.revokeObjectURL(previewImage);
    setPreviewImage("");
    if (imgRef.current) imgRef.current.value = "";
    setValue("image", null, { shouldValidate: true, shouldDirty: true });
  }

  function onRemoveCurrentPhotoHandler() {
    setValue("removeImage", true, { shouldValidate: true, shouldDirty: true });
  }

  function onUndoRemovePhotoHandler() {
    setValue("removeImage", false, { shouldValidate: true, shouldDirty: true });
  }

  function closeHandler() {
    if (previewImage) URL.revokeObjectURL(previewImage);
    onClose();
  }

  // Update function
  const { mutate, isPending } = useMutation({
    mutationFn: (data: PostEditFormSchema) => {
      const postForm = new FormData();
      postForm.append("body", data.body);
      postForm.append("privacy", data.privacy);
      if (data.image) {
        postForm.append("image", data.image);
      } else if (data.removeImage) {
        postForm.append("removeImage", "true");
      }
      return updatePost(token, postId, postForm);
    },
    onSuccess: function (data) {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
      queryClient.invalidateQueries({ queryKey: ["singlePosts", postId] });
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
    <form onSubmit={handleSubmit((data) => mutate(data))} className="mt-3">
      {/* Text Area */}
      <textarea
        {...register("body")}
        autoFocus
        maxLength={POST_BODY_MAX_LENGTH}
        className="min-h-27.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-[#1877f2]/20 focus:border-[#1877f2] focus:ring-2"
      ></textarea>
      {errors.body && (
        <p className="mt-1 text-xs font-semibold text-rose-600">
          {errors.body.message}
        </p>
      )}

      {/* Image */}
      {displayedImage && (
        <div className="relative mt-2">
          <img
            alt="Post"
            className="max-h-60 w-full rounded-lg object-cover"
            src={displayedImage}
          />
          <button
            type="button"
            onClick={
              previewImage
                ? onRemoveNewPhotoHandler
                : onRemoveCurrentPhotoHandler
            }
            className="absolute right-2 top-2 cursor-pointer rounded-full bg-black/60 px-1.5 py-1 text-white backdrop-blur-sm"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Und alert*/}
      {isImageRemoved && !previewImage && (
        <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>The photo will be removed when you save.</span>
          <button
            type="button"
            onClick={onUndoRemovePhotoHandler}
            className="font-bold text-[#1877f2] hover:underline"
          >
            Undo
          </button>
        </p>
      )}

      {/* Actions row */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Change / Add photo */}
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
            <span>{displayedImage ? "Change photo" : "Add photo"}</span>
          </label>

          {/* Privacy selector */}
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
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
