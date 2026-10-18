import { useEffect, useMemo, useRef } from "react";
import { Spinner } from "@heroui/react";
import { PostCard } from "./components/PostCard";
import toast from "react-hot-toast";
import { getAllPosts } from "../../service/Post.service";
import { useAuth } from "../../context/AuthProvider";
import { Loader } from "../Shared/Loader/Loader";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Post } from "../../interfaces/post";

export const PostListing = () => {
  const { token } = useAuth();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["allPosts"],
    queryFn: ({ pageParam }) => getAllPosts(token, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data.meta?.pagination;
      if (!pagination) return undefined;
      return pagination.currentPage < pagination.numberOfPages
        ? pagination.currentPage + 1
        : undefined;
    },
  });

  const posts = useMemo(() => {
    const all: Post[] =
      data?.pages.flatMap((page) => page.data.data.posts) ?? [];
    return Array.from(new Map(all.map((post) => [post.id, post])).values());
  }, [data]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, posts.length]);

  useEffect(() => {
    if (isError) toast.error(error?.message ?? "Something wrong");
  }, [isError, error]);

  if (isLoading) return <Loader />;
  if (isError) return null;

  return (
    <>
      {posts.map((post: Post) => (
        <PostCard key={post.id} post={post} variant={"listing"} />
      ))}

      {/* Loader */}
      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isFetchingNextPage && <Spinner size="lg" />}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-sm font-semibold text-slate-500">
            You're all caught up.
          </p>
        )}
      </div>
    </>
  );
};
