import { z } from "zod";

export const registrationSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  confirm_password: z.string().min(6),
});

// password reset schema
export const resetPasswordSchema = z.object({
  password: z.string().min(6),
  confirm_password: z.string().min(6),
});

// login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// update password schema
export const updatePasswordSchema = z.object({
  current_password: z.string().min(6),
  password: z.string().min(6),
});

// update user schema
export const updateUserSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
});

// user verify schema
export const verifyUserSchema = z.object({
  email: z.string().email(),
});
