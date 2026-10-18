import * as z from "zod";
import { POST_BODY_MAX_LENGTH } from "./Post";
export const COMMENT_MAX_LENGTH = POST_BODY_MAX_LENGTH;

export const commentSchema = z
  .object({
    content: z
      .string()
      .trim()
      .max(
        COMMENT_MAX_LENGTH,
        `Comment must be at most ${COMMENT_MAX_LENGTH} characters.`,
      )
      .optional(),

    image: z.instanceof(File).nullable().optional(),
  })
  .refine((data) => Boolean(data.content) || data.image != null, {
    message: "Write something or add a photo to comment.",
    path: ["content"],
  });

export type CommentFormSchema = z.infer<typeof commentSchema>;

export const createCommentEditSchema = (hasExistingImage: boolean) =>
  z
    .object({
      content: z
        .string()
        .trim()
        .max(
          COMMENT_MAX_LENGTH,
          `Comment must be at most ${COMMENT_MAX_LENGTH} characters.`,
        ),

      image: z.instanceof(File).nullable().optional(),
    })
    .refine(
      (data) => Boolean(data.content) || hasExistingImage || data.image != null,
      {
        message: "Write something to update your comment.",
        path: ["content"],
      },
    );

export type CommentEditFormSchema = z.infer<
  ReturnType<typeof createCommentEditSchema>
>;
