import { useState } from "react";
import type { Post } from "../../../interfaces/post";
import { CommentItem } from "../../commentListing/CommentItem";
import { CommentListing } from "../../commentListing/CommentListing";

interface PostCommentsProps {
  post: Post;
  isDetails: boolean;
}

export const PostComments = ({ post, isDetails }: PostCommentsProps) => {
  const [showMoreComments, setShowMoreComments] = useState(false);
  const { topComment, commentsCount } = post;
  if (isDetails) {
    return <CommentListing postId={post._id} />;
  }
  return (
    <>
      {topComment && !showMoreComments && (
        <CommentItem comment={topComment} postId={post._id} />
      )}
      {commentsCount > 1 && !showMoreComments && (
        <button
          onClick={() => setShowMoreComments(true)}
          className="mt-2 text-xs font-bold text-[#1877f2] hover:underline"
        >
          View all comments
        </button>
      )}

      {commentsCount > 1 && showMoreComments && (
        <CommentListing postId={post._id} />
      )}
    </>
  );
};
