import { useState } from "react";
import { Dropdown, Label } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuth } from "../../context/AuthProvider";
import {
  deletePostComment,
  likePostComment,
} from "../../service/comment.service";
import { formatTimeAgo } from "../../utils/formatTimeAgo";
import { type Comment } from "./../../interfaces/comment";
import { CommentEditForm } from "./CommentEditForm";
import { ImageViewer } from "../Shared/ImageViewer/ImageViewer";

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

export const CommentItem = ({ comment, postId }: CommentItemProps) => {
  const {
    _id: commentId,
    commentCreator: { _id: creatorId, name, photo, username },
    content,
    likes,
    repliesCount,
    image,
    createdAt,
  } = comment;

  const [isEditing, setIsEditing] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const { token, currentUserId } = useAuth();
  const queryClient = useQueryClient();
  const isMyComment = creatorId === currentUserId;
  const isLiked = !!currentUserId && likes.includes(currentUserId);

  // Delete function
  const { mutate: deleteCommentHandler } = useMutation({
    mutationFn: () => deletePostComment(token, postId, commentId),
    onSuccess: function (data) {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["PostComments", postId] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["singlePosts", postId] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: function (error) {
      toast.error(
        isAxiosError(error) ? error.response?.data.message : error.message,
      );
    },
  });

  // Like function
  const { mutate: likeCommentHandler } = useMutation({
    mutationFn: () => likePostComment(token, postId, commentId),
    onSuccess: function (data) {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["PostComments", postId] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["singlePosts", postId] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
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
    <>
      <div className="space-y-2">
        <div className="relative flex items-start gap-2">
          {/* Profile Photo */}
          <img
            alt={name}
            className="mt-0.5 h-8 w-8 rounded-full object-cover"
            src={photo}
          />

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <CommentEditForm
                comment={comment}
                postId={postId}
                onClose={() => setIsEditing(false)}
              />
            ) : (
              <>
                <div className="relative inline-block max-w-full rounded-2xl bg-[#f0f2f5] px-3 py-2">
                  {/* Name and Username*/}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {name}{" "}
                      </p>
                      <p className="text-xs text-slate-500">@{username}</p>
                    </div>
                  </div>

                  {/* Comment */}
                  {content && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
                      {content}
                    </p>
                  )}

                  {/* Comment image*/}
                  {image && (
                    <button
                      type="button"
                      onClick={() => setIsImageOpen(true)}
                      className="group relative mt-2 block w-full cursor-zoom-in overflow-hidden rounded-lg"
                    >
                      <img
                        alt="Comment"
                        className="max-h-52 w-full object-cover"
                        src={image}
                      />
                      <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10"></span>
                    </button>
                  )}
                </div>

                {/* Date , likes and Reply*/}
                <div className="mt-1.5 flex items-center justify-between px-1">
                  <div className="flex items-center gap-4">
                    <span
                      title={new Date(createdAt).toLocaleString()}
                      className="text-xs font-semibold text-slate-400"
                    >
                      {formatTimeAgo(createdAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() => likeCommentHandler()}
                      className={`cursor-pointer text-xs font-semibold hover:underline disabled:opacity-60 ${
                        isLiked ? "text-[#1877f2]" : "text-slate-500"
                      }`}
                    >
                      Like ({likes.length})
                    </button>
                    <button
                      type="button"
                      className="text-xs font-semibold text-slate-500 transition hover:text-[#1877f2] hover:underline disabled:opacity-60"
                    >
                      Reply ({repliesCount})
                    </button>
                  </div>

                  {/* Options button */}
                  {isMyComment && (
                    <div className="relative" data-comment-menu-root="true">
                      <Dropdown>
                        <Dropdown.Trigger className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                          <i className="fa-solid fa-ellipsis text-base"></i>
                        </Dropdown.Trigger>

                        <Dropdown.Popover className="right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                          <Dropdown.Menu dir="ltr">
                            {/* Edit comment */}
                            <Dropdown.Item
                              id="edit"
                              onAction={() => setIsEditing(true)}
                              textValue="Edit comment"
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              <i className="fa-solid fa-pencil text-[15px]"></i>
                              <Label>Edit comment</Label>
                            </Dropdown.Item>

                            {/* Delete comment*/}
                            <Dropdown.Item
                              id="delete"
                              onAction={() => deleteCommentHandler()}
                              textValue="Delete comment"
                              variant="danger"
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                            >
                              <i className="fa-solid fa-trash-can text-[15px]"></i>
                              <Label>Delete comment</Label>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image viewer */}
      {isImageOpen && image && (
        <ImageViewer
          src={image}
          alt="Comment"
          onClose={() => setIsImageOpen(false)}
        />
      )}
    </>
  );
};
