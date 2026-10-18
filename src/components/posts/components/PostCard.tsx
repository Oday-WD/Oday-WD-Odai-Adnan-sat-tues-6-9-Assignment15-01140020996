import { Card } from "@heroui/react";
import { PostHeader } from "./PostHeader";
import { PostStats } from "./PostStats";
import { PostActions } from "./PostActions";
import type { Post } from "../../../interfaces/post";
import { PostComments } from "./PostComments";
import { PostEditForm } from "./PostEditForm";
import { useState } from "react";
import { CommentForm } from "../../commentListing/CommentForm";
import { ImageViewer } from "../../Shared/ImageViewer/ImageViewer";

interface PostCardProps {
  post: Post;
  variant: "listing" | "details";
}

export const PostCard = ({ post, variant }: PostCardProps) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <Card>
      <Card.Header>
        <PostHeader post={post} onEditPost={() => setIsEditing(true)} />
      </Card.Header>
      <Card.Content>
        {isEditing ? (
          <PostEditForm post={post} onClose={() => setIsEditing(false)} />
        ) : (
          post?.body && (
            <p className="mt-3 text-sm leading-relaxed">{post.body}</p>
          )
        )}
        {post?.image && !isEditing && (
          <div className="max-h-155 overflow-hidden border-y border-slate-200">
            <button
              type="button"
              onClick={() => setIsImageOpen(true)}
              className="group relative block w-full cursor-zoom-in"
            >
              <img
                alt={post?.body ?? "Body"}
                className="w-full object-cover"
                src={post.image}
              />
              <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10"></span>
            </button>
          </div>
        )}
      </Card.Content>
      <Card.Content>
        <PostStats post={post} />
        <div className="mx-4 border-t-2 border-slate-300"></div>
        <PostActions
          commentFormToggler={() => setIsCommentOpen(!isCommentOpen)}
          post={post}
        />
        <PostComments post={post} isDetails={variant == "details"} />
        {isCommentOpen && <CommentForm postId={post._id} />}
      </Card.Content>

      {/* Image viewer */}
      {isImageOpen && post?.image && (
        <ImageViewer
          src={post.image}
          alt={post?.body ?? "Post image"}
          onClose={() => setIsImageOpen(false)}
        />
      )}
    </Card>
  );
};