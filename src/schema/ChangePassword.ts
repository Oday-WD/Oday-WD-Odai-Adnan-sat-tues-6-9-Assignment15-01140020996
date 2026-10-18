import * as z from "zod";

export const changePasswordSchema = z
  .object({
    // Current password
    currentPassword: z.string().nonempty("Current password is required."),

    // New password
    newPassword: z
      .string()
      .nonempty("New password is required.")
      .min(8, "Password must be at least 8 characters.")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character.",
      ),

    // Confirm new password
    confirmPassword: z.string().nonempty("Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from the current one.",
    path: ["newPassword"],
  });

export type ChangePasswordFormSchema = z.infer<typeof changePasswordSchema>;