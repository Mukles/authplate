import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string({
        required_error: "This field has to be filled.",
      })
      .min(3, { message: "This field has to be filled." }),
    lastName: z
      .string({
        required_error: "This field has to be filled.",
      })
      .min(3, { message: "This field has to be filled." }),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(32, { message: "Password must be less than 32 characters long" })
      .trim() // Remove leading and trailing whitespace
      .refine((value) => /[a-z]/i.test(value), {
        message: "Password must contain at least one letter",
      })
      .refine((value) => /\d/.test(value), {
        message: "Password must contain at least one digit",
      })
      .refine((value) => /[!@#$%^&*()_+\-=\[\]{};':",./<>?|\\`~]/.test(value), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string().optional(),
    isTermsAccepted: z.boolean().refine((value) => value, {
      message: "You must agree to the terms and conditions",
    }),
    provider: z
      .enum(["google", "github", "credential"])
      .default("credential")
      .optional(),
  })
  .refine(
    (data) =>
      data.password.length > 0 && data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password must be less than 32 characters long" })
    .trim() // Remove leading and trailing whitespace
    .refine((value) => /[a-z]/i.test(value), {
      message: "Password must contain at least one letter",
    })
    .refine((value) => /\d/.test(value), {
      message: "Password must contain at least one digit",
    })
    .refine((value) => /[!@#$%^&*()_+\-=\[\]{};':",./<>?|\\`~]/.test(value), {
      message: "Password must contain at least one special character",
    }),
});
