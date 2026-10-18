import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuth } from "../../context/AuthProvider";
import { uploadProfilePhoto } from "../../service/profile.service";
import type { Post } from "../../interfaces/post";
import { ImageViewer } from "../Shared/ImageViewer/ImageViewer";
import { ProfilePhotoCropModal } from "./ProfilePhotoCropModal";

interface ProfileAvatarProps {
  photo: string;
  name: string;
  isMe: boolean;
}

export const ProfileAvatar = ({ photo, name, isMe }: ProfileAvatarProps) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const photoRef = useRef<HTMLInputElement | null>(null);

  function onChangePhotoHandler() {
    const file = photoRef.current?.files?.[0] ?? null;
    if (file) setSelectedFile(file);
  }

  function closeCropHandler() {
    setSelectedFile(null);
    if (photoRef.current) photoRef.current.value = "";
  }

  // Upload function
  const { mutate, isPending } = useMutation({
    mutationFn: ({
      file,
      privacy,
    }: {
      file: File;
      privacy: Post["privacy"];
    }) => {
      const photoForm = new FormData();
      photoForm.append("photo", file);
      photoForm.append("privacy", privacy);
      return uploadProfilePhoto(token, photoForm);
    },
    onSuccess: function (data) {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      closeCropHandler();
    },
    onError: function (error) {
      toast.error(
        isAxiosError(error) ? error.response?.data.message : error.message,
      );
    },
  });

  return (
    <>
      <div className="group/avatar relative shrink-0">
        <button
          type="button"
          onClick={() => setIsImageOpen(true)}
          className="cursor-zoom-in rounded-full"
        >
          <img
            alt={name}
            className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
            src={photo}
          />
        </button>

        {/* View profile photo */}
        <button
          type="button"
          onClick={() => setIsImageOpen(true)}
          title="View profile photo"
          aria-label="View profile photo"
          className="absolute bottom-1 left-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#1877f2] opacity-100 shadow-sm ring-1 ring-slate-200 transition duration-200 hover:bg-slate-50 sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100"
        >
          <i className="fa-solid fa-expand"></i>
        </button>

        {/* Change profile photo */}
        {isMe && (
          <label
            title="Change profile photo"
            className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white opacity-100 shadow-sm transition duration-200 hover:bg-[#166fe5] sm:opacity-0 sm:group-hover/avatar:opacity-100 sm:group-focus-within/avatar:opacity-100"
          >
            <i className="fa-solid fa-camera"></i>
            <input
              accept="image/*"
              className="hidden"
              type="file"
              ref={photoRef}
              onChange={onChangePhotoHandler}
            />
          </label>
        )}
      </div>

      {/* Crop modal */}
      {selectedFile && (
        <ProfilePhotoCropModal
          file={selectedFile}
          isPending={isPending}
          onSave={(file, privacy) => mutate({ file, privacy })}
          onClose={closeCropHandler}
        />
      )}

      {/* Image viewer */}
      {isImageOpen && (
        <ImageViewer
          src={photo}
          alt={name}
          onClose={() => setIsImageOpen(false)}
        />
      )}
    </>
  );
};
