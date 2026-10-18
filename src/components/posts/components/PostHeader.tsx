import { Link } from "react-router-dom";
import { Dropdown, Label } from "@heroui/react";
import { type Post } from "./../../../interfaces/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bookmarkPost,
  deletePost,
  updatePost,
} from "../../../service/Post.service";
import { useAuth } from "../../../context/AuthProvider";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";
import { privacyConfig } from "../../../utils/privacyConfig";

interface PostHeaderProps {
  post: Post;
  onEditPost: () => void;
}

export const PostHeader = ({
  post: {
    user: { name, photo, username, _id },
    createdAt,
    privacy,
    body,
    _id: postId,
    bookmarked,
  },
  onEditPost,
}: PostHeaderProps) => {
  const { token, currentUserId } = useAuth();
  const queryClient = useQueryClient();
  const isMyPost = _id === currentUserId;

  // Delete function
  const { mutate: deletePostHandler } = useMutation({
    mutationFn: () => deletePost(token, postId),
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

  // Update function
  const { mutate: updatePrivacyHandler, isPending: isPrivacyPending } =
    useMutation({
      mutationFn: (newPrivacy: Post["privacy"]) => {
        const postForm = new FormData();
        postForm.append("body", body ?? "");
        postForm.append("privacy", newPrivacy);
        return updatePost(token, postId, postForm);
      },
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

  // Save function
  const { mutate: bookmarkPostHandler } = useMutation({
    mutationFn: () => bookmarkPost(token, postId),
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
    <div className="flex items-center gap-3">
      {/* Profile Photo */}
      <Link className="shrink-0" to={`/profile/${_id}`}>
        <img
          alt="Profile Photo"
          className="h-11 w-11 rounded-full object-cover"
          src={photo}
        />
      </Link>

      {/* Profile Details */}
      <div className="min-w-0 flex-1">
        {/* Name */}
        <Link
          className="truncate text-sm font-bold text-foreground hover:underline"
          to={`/profile/${_id}`}
        >
          {name}
        </Link>
        {/* Username, Post time and privacy */}
        <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          @{username}
          <button
            type="button"
            title={new Date(createdAt).toLocaleString()}
            className="rounded px-0.5 py-0.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 hover:underline"
          >
            {formatTimeAgo(createdAt)}
          </button>
          <span className="mx-1">·</span>
          {/* Public/Followers/OnlyMe */}
          {isMyPost ? (
            <span className="relative inline-flex items-center">
              <Dropdown>
                <Dropdown.Trigger className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-semibold text-muted-foreground hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
                  <i
                    className={`${privacyConfig[privacy].icon} text-[11px]`}
                  ></i>
                  {privacyConfig[privacy].label}
                  <i className="fa-solid fa-chevron-down text-[12px]"></i>
                </Dropdown.Trigger>

                <Dropdown.Popover className="left-0 top-[calc(100%+6px)] z-30 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  <Dropdown.Menu
                    onAction={(key) => {
                      if (isPrivacyPending || key === privacy) return;
                      updatePrivacyHandler(key as Post["privacy"]);
                    }}
                    dir="ltr"
                  >
                    {/* Public */}
                    <Dropdown.Item
                      id="public"
                      textValue="Public"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <i className="fa-solid fa-earth-americas text-[13px]"></i>
                      <Label>Public</Label>
                    </Dropdown.Item>

                    {/* Followers */}
                    <Dropdown.Item
                      id="following"
                      textValue="Followers"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <i className="fa-solid fa-users text-[13px]"></i>
                      <Label>Followers</Label>
                    </Dropdown.Item>

                    {/* Only me */}
                    <Dropdown.Item
                      id="only_me"
                      textValue="Only me"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <i className="fa-solid fa-lock text-[13px]"></i>
                      <Label>Only me</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1 py-0.5 text-xs font-semibold text-muted-foreground">
              <i className={`${privacyConfig[privacy].icon} text-[11px]`}></i>
              {privacyConfig[privacy].label}
            </span>
          )}
          {bookmarked && (
            <>
              <span className="mx-1">·</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1877f2]">
                <i className="fa-solid fa-bookmark text-[11px]"></i>
                Saved
              </span>
            </>
          )}
        </div>
      </div>

      {/* Options button*/}
      <div className="relative">
        <Dropdown>
          <Dropdown.Trigger className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
            <i className="fa-solid fa-ellipsis text-lg"></i>
          </Dropdown.Trigger>

          <Dropdown.Popover className="right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            <Dropdown.Menu
              dir="ltr"
            >
              {/* Save / Unsave post */}
              <Dropdown.Item
                id="save"
                onAction={bookmarkPostHandler}
                textValue={bookmarked ? "Unsave post" : "Save post"}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <i
                  className={`${bookmarked ? "fa-solid text-[#1877f2]" : "fa-regular"} fa-bookmark text-[15px]`}
                ></i>
                <Label>{bookmarked ? "Unsave post" : "Save post"}</Label>
              </Dropdown.Item>

              {/* Edit post */}
              {isMyPost && (
                <Dropdown.Item
                  id="edit"
                  onAction={onEditPost}
                  textValue="Edit post"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <i className="fa-solid fa-pencil text-[15px]"></i>
                  <Label>Edit post</Label>
                </Dropdown.Item>
              )}

              {/* Delete post */}
              {isMyPost && (
                <Dropdown.Item
                  id="delete"
                  onAction={deletePostHandler}
                  textValue="Delete post"
                  variant="danger"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <i className="fa-solid fa-trash-can text-[15px]"></i>
                  <Label>Delete post</Label>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </div>
  );
};
