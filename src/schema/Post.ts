import * as z from "zod";

export const POST_BODY_MAX_LENGTH = 300;
const privacySchema = z.enum(["public", "following", "only_me"]);

export const postSchema = z
  .object({
    body: z
      .string()
      .trim()
      .max(
        POST_BODY_MAX_LENGTH,
        `Post must be at most ${POST_BODY_MAX_LENGTH} characters.`,
      )
      .optional(),

    image: z.instanceof(File).nullable().optional(),

    privacy: privacySchema,
  })
  .refine((data) => Boolean(data.body) || data.image != null, {
    message: "Write something or add a photo to post.",
    path: ["body"],
  });

export type PostFormSchema = z.infer<typeof postSchema>;

export const createPostEditSchema = (hasExistingImage: boolean) =>
  z
    .object({
      body: z
        .string()
        .trim()
        .max(
          POST_BODY_MAX_LENGTH,
          `Post must be at most ${POST_BODY_MAX_LENGTH} characters.`,
        ),

      image: z.instanceof(File).nullable().optional(),

      removeImage: z.boolean(),

      privacy: privacySchema,
    })
    .refine(
      (data) =>
        Boolean(data.body) ||
        data.image != null ||
        (hasExistingImage && !data.removeImage),
      {
        message: "Write something to update your post.",
        path: ["body"],
      },
    );

export type PostEditFormSchema = z.infer<
  ReturnType<typeof createPostEditSchema>
>;
