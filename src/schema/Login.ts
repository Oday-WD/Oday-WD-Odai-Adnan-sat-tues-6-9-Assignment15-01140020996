import * as z from "zod";

export const loginSchema = z.object({
  // Email
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address."),

  // Password
  password: z
    .string()
    .nonempty("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
      "Password must include uppercase, lowercase, number, and special character.",
    ),
});

export type LoginFormeSchemaInput = z.input<typeof loginSchema>;
export type LoginFormeSchema = z.infer<typeof loginSchema>;
