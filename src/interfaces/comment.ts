import type { ApiResponse } from "./ApiResponse";
import type { User } from "./user";

export interface Comment {
  _id: string;
  content: string;
  commentCreator: User;
  post: string;
  parentComment: any;
  likes: string[];
  createdAt: string;
  repliesCount: number;
  image: string;
}
export interface Comments {
  comments: Comment[];
}
export type CommentResponse = ApiResponse<Comment>;
