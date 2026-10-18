import { useRef, useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuth } from "../../context/AuthProvider";
import { removeCover, uploadCover } from "../../service/profile.service";
import type { Post } from "../../interfaces/post";
import { ImageViewer } from "../Shared/ImageViewer/ImageViewer";

interface ProfileCoverProps {
  cover?: string;
  isMe: boolean;
}

const actionButtonClass =
  "pointer-events-auto inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs";

export const ProfileCover = ({ cover, isMe }: ProfileCoverProps) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState<Post["privacy"]>("public");
  const coverRef = useRef<HTMLInputElement | null>(null);

  function onChangeCoverHandler() {
    const file = coverRef.current?.files?.[0] ?? null;
    if (file) setSelectedFile(file);
  }

  function closeModalHandler() {
    setSelectedFile(null);
    setPrivacy("public");
    if (coverRef.current) coverRef.current.value = "";
  }

  function invalidateProfileData() {
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    queryClient.invalidateQueries({ queryKey: ["userPosts"] });
  }

  // Upload function
  const { mutate: uploadCoverHandler, isPending: isUploading } = useMutation({
    mutationFn: () => {
      const coverForm = new FormData();
      coverForm.append("cover", selectedFile!);
      coverForm.append("privacy", privacy);
      return uploadCover(token, coverForm);
    },
    onSuccess: function (data) {
      toast.success(data.data.message);
      invalidateProfileData();
      closeModalHandler();
    },
    onError: function (error) {
      toast.error(
        isAxiosError(error) ? error.response?.data.message : error.message,
      );
    },
  });

  // Remove function
  const { mutate: removeCoverHandler, isPending: isRemoving } = useMutation({
    mutationFn: () => removeCover(token),
    onSuccess: function (data) {
      toast.success(data.data.message);
      invalidateProfileData();
    },
    onError: function (error) {
      toast.error(
        isAxiosError(error) ? error.response?.data.message : error.message,
      );
    },
  });

  return (
    <>
      <div
        className="group/cover relative h-44 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] sm:h-52 lg:h-60"
        style={
          cover
            ? {
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.22), rgba(15, 23, 42, 0.4)), url("${cover}")`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(186,230,253,.22)_0%,rgba(186,230,253,0)_44%)]"></div>
        <div className="absolute -left-16 top-10 h-36 w-36 rounded-full bg-white/8 blur-3xl"></div>
        <div className="absolute right-8 top-6 h-48 w-48 rounded-full bg-[#c7e6ff]/10 blur-3xl"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/25 to-transparent"></div>

        {/* Cover actions */}
        <div className="pointer-events-none absolute right-2 top-2 z-10 flex max-w-[90%] flex-wrap items-center justify-end gap-1.5 opacity-100 transition duration-200 sm:right-3 sm:top-3 sm:max-w-none sm:gap-2 sm:opacity-0 sm:group-hover/cover:opacity-100 sm:group-focus-within/cover:opacity-100">
          {/* View cover */}
          {cover && (
            <button
              type="button"
              onClick={() => setIsImageOpen(true)}
              className={actionButtonClass}
            >
              <i className="fa-solid fa-expand"></i>
              View cover
            </button>
          )}

          {/* Add / Change cover */}
          {isMe && (
            <label className={actionButtonClass}>
              <i className="fa-solid fa-camera"></i>
              {cover ? "Change cover" : "Add cover"}
              <input
                accept="image/*"
                className="hidden"
                type="file"
                ref={coverRef}
                onChange={onChangeCoverHandler}
              />
            </label>
          )}

          {/* Remove cover */}
          {isMe && cover && (
            <button
              type="button"
              onClick={() => removeCoverHandler()}
              disabled={isRemoving}
              className={actionButtonClass}
            >
              {isRemoving ? (
                <Spinner color="current" size="sm" />
              ) : (
                <i className="fa-solid fa-trash-can"></i>
              )}
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Cover privacy modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-lg font-extrabold text-slate-900">
              Cover post privacy
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Choose who can see the post generated for your new cover photo.
            </p>

            <div className="mt-4">
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value as Post["privacy"])}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-[#1877f2]"
              >
                <option value="public">Public</option>
                <option value="following">Followers</option>
                <option value="only_me">Only me</option>
              </select>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeModalHandler}
                disabled={isUploading}
                className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <Button
                type="button"
                onPress={() => uploadCoverHandler()}
                isDisabled={isUploading}
                className="inline-flex items-center rounded-lg bg-[#1877f2] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:opacity-60"
              >
                {isUploading ? (
                  <Spinner color="current" size="sm" />
                ) : (
                  "Save cover"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image viewer */}
      {isImageOpen && cover && (
        <ImageViewer
          src={cover}
          alt="Cover"
          onClose={() => setIsImageOpen(false)}
        />
      )}
    </>
  );
};