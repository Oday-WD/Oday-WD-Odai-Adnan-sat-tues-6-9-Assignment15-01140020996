import type { Post } from "../../../interfaces/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../../../service/Post.service";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthProvider";
import { isAxiosError } from "axios";

interface PostActionsProps {
  commentFormToggler: () => void;
  post: Post;
}

export const PostActions = ({ commentFormToggler, post }: PostActionsProps) => {
  const {
    _id: postId,
    user: { _id },
    likes,
  } = post;

  const { token, currentUserId } = useAuth();
  const queryClient = useQueryClient();

  const isLiked = !!currentUserId && likes.includes(currentUserId);

  // Like function
  const { mutate: likePostHandler, isPending } = useMutation({
    mutationFn: () => likePost(token, postId),
    onSuccess: function (data) {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", _id] });
      queryClient.invalidateQueries({ queryKey: ["singlePosts", postId] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: function (error) {
      toast.error(
        isAxiosError(error) ? error.response?.data.message : error.message,
      );
    },
  });

  return (
    <div className="grid grid-cols-3 gap-1 p-1">
      {/* Like */}
      <button
        onClick={() => likePostHandler()}
        disabled={isPending}
        className={`cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm hover:bg-slate-100 ${
          isLiked ? "text-[#1877f2]" : "text-slate-600"
        }`}
      >
        <i
          className={`${isLiked ? "fa-solid" : "fa-regular"} fa-thumbs-up text-lg`}
        ></i>
        <span>Like</span>
      </button>

      {/* Comment */}
      <button
        onClick={commentFormToggler}
        className="cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm text-slate-600 hover:bg-slate-100"
      >
        <i className="fa-regular fa-comment-dots text-lg"></i>
        <span>Comment</span>
      </button>

      {/* Share */}
      <button className="cursor-pointer flex items-center justify-center gap-1.5 rounded-md p-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:text-sm text-slate-600 hover:bg-slate-100">
        <i className="fa-solid fa-share-nodes text-lg"></i>
        <span>Share</span>
      </button>
    </div>
  );
};
