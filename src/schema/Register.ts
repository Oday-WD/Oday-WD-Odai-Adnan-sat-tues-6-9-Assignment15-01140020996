import * as z from "zod";

export const registerSchema = z
  .object({
    // Name
    name: z
      .string()
      .trim()
      .nonempty("Full name is required.")
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name must be at most 50 characters."),

    // Username
    username: z
      .string()
      .trim()
      .nonempty("Username is required.")
      .min(3, "Username must be at least 3 characters.")
      .max(15, "Username must be at most 15 characters.")
      .regex(
        /^[a-z0-9_-]{3,15}$/,
        "Username must be using only lowercase letters, numbers, underscores, or hyphens",
      ),

    // Email
    email: z
      .string()
      .nonempty("Email is required")
      .email("Please enter a valid email address."),

    // Date Of Birth
    dateOfBirth: z.coerce
      .date()
      .refine(
        (value) => {
          const today = new Date();
          let age = today.getFullYear() - value.getFullYear();
          const hasHadBirthdayThisYear =
            today.getMonth() > value.getMonth() ||
            (today.getMonth() === value.getMonth() &&
              today.getDate() >= value.getDate());
          if (!hasHadBirthdayThisYear) age--;
          return age >= 18;
        },
        { message: "Your age must be at least 18 years old." },
      )
      .transform((date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }),

    // Gender
    gender: z.enum(["male", "female"], { message: "Gender is required." }),

    // Password
    password: z
      .string()
      .nonempty("Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
        "Password must include uppercase, lowercase, number, and special character.",
      ),

    // RePassword
    rePassword: z.string().nonempty("Please confirm your password."),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match.",
    path: ["rePassword"],
  });


export type RegisterFormeSchemaInput = z.input<typeof registerSchema>;
export type RegisterFormeSchema = z.infer<typeof registerSchema>;
