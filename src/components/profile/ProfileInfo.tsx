import { useQuery } from "@tanstack/react-query";
import {
  getMyProfileInfo,
  getProfileInfo,
  getUserPosts,
} from "../../service/profile.service";
import { useAuth } from "../../context/AuthProvider";
import { ProfileCover } from "./ProfileCover";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileUserInfo } from "./ProfileUserInfo";

interface ProfileInfoProps {
  userId: string;
}

export const ProfileInfo = ({ userId }: ProfileInfoProps) => {
  const { token, currentUserId } = useAuth();
  const isMe = userId === currentUserId;

  const { data: user } = useQuery({
    queryKey: ["profile", userId, isMe],
    queryFn: () =>
      isMe ? getMyProfileInfo(token) : getProfileInfo(token, userId),
    select: (data) => data.data.data.user,
    enabled: !!userId,
  });

  const { data: postsCount } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => getUserPosts(token, userId),
    select: (data) => data.data.meta.pagination.total as number,
    enabled: !!userId,
  });

  if (!user) return null;
  if (!isMe) {
    return <ProfileUserInfo user={user} postsCount={postsCount ?? 0} />;
  }

  const bookmarksCount = Math.max(0, (user.bookmarksCount ?? 0) - 1);

  const stats = [
    { label: "Followers", value: user.followersCount ?? 0 },
    { label: "Following", value: user.followingCount ?? 0 },
    { label: "Bookmarks", value: bookmarksCount },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
      <ProfileCover cover={user.cover} isMe={isMe} />

      <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
        <div className="rounded-3xl border border-white/60 bg-white/90 p-5 backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            {/* Avatar + name */}
            <div className="min-w-0">
              <div className="flex items-end gap-4">
                <ProfileAvatar
                  photo={user.photo}
                  name={user.name}
                  isMe={isMe}
                />

                <div className="min-w-0 pb-1">
                  <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    {user.name}
                  </h2>
                  <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">
                    @{user.username}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">
                    <i className="fa-solid fa-users text-[12px]"></i>
                    Route Posts member
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid w-full grid-cols-3 gap-2 lg:w-130">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
            {/* About */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-extrabold text-slate-800">About</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {user.email && (
                  <p className="flex items-center gap-2">
                    <i className="fa-regular fa-envelope text-slate-500"></i>
                    {user.email}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <i className="fa-solid fa-users text-slate-500"></i>
                  Active on Route Posts
                </p>
              </div>
            </div>

            {/* Counters */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                  My posts
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {postsCount ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                  Saved posts
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {bookmarksCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
