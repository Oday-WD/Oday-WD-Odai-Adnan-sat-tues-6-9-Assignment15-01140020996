import { PostCard } from "../posts/components/PostCard";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";
import { Loader } from "../Shared/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import type { Post } from "../../interfaces/post";
import { getBookmarks, getUserPosts } from "../../service/profile.service";
import type { ProfileFilterType } from "./ProfileFilter";

interface ProfileListingProps {
  userId: string;
  filter: ProfileFilterType;
}

export const ProfileListing = ({ userId, filter }: ProfileListingProps) => {
  const { token } = useAuth();
  const isSaved = filter === "saved";

  const postsQuery = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => getUserPosts(token, userId),
    select: (data) => data.data.data.posts,
    enabled: !!userId && !isSaved,
  });

  const savedQuery = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks(token),
    select: (data) => data.data.data.bookmarks,
    enabled: isSaved,
  });

  const { data, isLoading, error, isError } = isSaved ? savedQuery : postsQuery;

  if (isLoading) return <Loader />;

  if (isError) {
    toast.error(error?.message ?? "Something wrong");
    return null;
  }

  if (!data?.length) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-500">
        {isSaved ? "No saved posts yet." : "No posts yet."}
      </p>
    );
  }

  return (
    <>
      {data.map((post: Post) => (
        <PostCard key={post.id} post={post} variant={"listing"} />
      ))}
    </>
  );
};