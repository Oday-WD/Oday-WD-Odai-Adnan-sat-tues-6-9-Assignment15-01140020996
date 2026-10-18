import { Link } from "react-router-dom";
import { type Post } from "./../../../interfaces/post";

interface PostStatsProps {
  post: Post;
}
export const PostStats = ({
  post: { sharesCount, commentsCount, likesCount, id: postId },
}: PostStatsProps) => {
  return (
    <div className="px-4 pb-2 pt-3 text-sm text-slate-500">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* likes count */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1877f2] text-white">
            <i className="fa-solid fa-thumbs-up text-[12px]"></i>
          </span>
          <span className="font-semibold transition">{likesCount} likes</span>
        </div>

        {/* share count + comments count + View details */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm">
          <span className="inline-flex items-center gap-1">
            <i className="fa-solid fa-retweet text-[13px]"></i>
            {sharesCount} shares
          </span>
          <span>{commentsCount} comments</span>
          <Link
            to={`/post/${postId}`}
            className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};
