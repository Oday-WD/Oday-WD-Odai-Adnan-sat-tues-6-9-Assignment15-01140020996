import type { User } from "./user";
import type { ApiResponse } from "./ApiResponse";
import type { Comment } from "./comment";

export interface Post {
  _id: string;
  body?: string;
  privacy: "public" | "following" | "only_me";
  user: User;
  sharedPost?: any;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment?: Comment;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
  image?: string;
}
export interface PostFormData {
  body?: string;
  image?: File | null;
}
export interface Posts {
  posts: Post[];
}
export type PostResponse = ApiResponse<Post>;
