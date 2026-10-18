import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ProfileInfo } from "./../../components/profile/ProfileInfo";
import { ProfileListing } from "../../components/profile/ProfileListing";
import {
  ProfileFilter,
  type ProfileFilterType,
} from "../../components/profile/ProfileFilter";
import { useAuth } from "../../context/AuthProvider";
import { getMyProfileInfo, getUserPosts } from "../../service/profile.service";

export const Profile = () => {
  const { userId } = useParams();
  const { token, currentUserId } = useAuth();
  const [filter, setFilter] = useState<ProfileFilterType>("posts");
  const isMe = userId === currentUserId;

  const { data: postsCount } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => getUserPosts(token, userId!),
    select: (data) => data.data.meta.pagination.total as number,
    enabled: !!userId,
  });

  const { data: bookmarksCount } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getMyProfileInfo(token),
    select: (data) =>
      Math.max(0, (data.data.data.user.bookmarksCount ?? 0) - 1),
    enabled: !!userId && isMe,
  });

  const activeFilter = isMe ? filter : "posts";

  return (
    <>
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main className="min-w-0 space-y-5 sm:space-y-6">
          {userId && <ProfileInfo userId={userId} />}
          {isMe && (
            <ProfileFilter
              active={activeFilter}
              onChange={setFilter}
              isMe={isMe}
              count={
                (activeFilter === "saved" ? bookmarksCount : postsCount) ?? 0
              }
            />
          )}
          {userId && <ProfileListing userId={userId} filter={activeFilter} />}
        </main>
      </div>
    </>
  );
};
