import { useState } from "react";
import { Spinner } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuth } from "../../context/AuthProvider";
import { followUser } from "../../service/profile.service";
import type { User } from "../../interfaces/user";
import { ImageViewer } from "../Shared/ImageViewer/ImageViewer";

interface ProfileUserInfoProps {
  user: User;
  postsCount: number;
}

export const ProfileUserInfo = ({ user, postsCount }: ProfileUserInfoProps) => {
  const { _id: userId, name, username, photo, cover } = user;
  const { token, currentUserId } = useAuth();
  const queryClient = useQueryClient();
  const [viewedImage, setViewedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const isFollowing = !!user.followers?.some(
    (follower) => follower._id === currentUserId,
  );

  const stats = [
    { label: "Followers", value: user.followersCount ?? 0 },
    { label: "Following", value: user.followingCount ?? 0 },
    { label: "Posts", value: postsCount },
  ];

  // Follow function
  const { mutate: followHandler, isPending } = useMutation({
    mutationFn: () => followUser(token, userId),
    onSuccess: function (data) {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
    onError: function (error) {
      toast.error(
        isAxiosError(error) ? error.response?.data.message : error.message,
      );
    },
  });

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Cover */}
        <div
          className="h-48 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)]"
          style={
            cover
              ? {
                  backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.35)), url("${cover}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                }
              : undefined
          }
        >
          {cover && (
            <button
              type="button"
              aria-label="View cover"
              onClick={() => setViewedImage({ src: cover, alt: "Cover" })}
              className="block h-full w-full cursor-zoom-in"
            ></button>
          )}
        </div>

        <div className="relative -mt-14 px-3 pb-5 sm:px-5">
          <div className="rounded-2xl border border-white/70 bg-white/95 p-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              {/* Avatar + name */}
              <div className="flex items-end gap-3">
                <button
                  type="button"
                  onClick={() => setViewedImage({ src: photo, alt: name })}
                  className="cursor-zoom-in rounded-full"
                >
                  <img
                    alt={name}
                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm sm:h-24 sm:w-24"
                    src={photo}
                  />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-xl font-black text-slate-900 sm:text-2xl">
                    {name}
                  </p>
                  <p className="text-sm font-semibold text-slate-500 sm:text-base">
                    @{username}
                  </p>
                </div>
              </div>

              {/* Follow button */}
              <button
                type="button"
                onClick={() => followHandler()}
                disabled={isPending}
                className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
                  isFollowing
                    ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    : "bg-[#1877f2] text-white hover:bg-[#166fe5]"
                }`}
              >
                {isPending ? (
                  <Spinner color="current" size="sm" />
                ) : (
                  <i
                    className={`fa-solid ${isFollowing ? "fa-check" : "fa-user-plus"}`}
                  ></i>
                )}
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    {stat.label}
                  </p>
                  <p className="text-xl font-black text-slate-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image viewer */}
      {viewedImage && (
        <ImageViewer
          src={viewedImage.src}
          alt={viewedImage.alt}
          onClose={() => setViewedImage(null)}
        />
      )}
    </>
  );
};
