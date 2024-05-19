import { registerSchema } from "@/lib/validation";
import { loginSchema } from "@/schema/userSchema";
import { z } from "zod";

export type Role = "admin" | "user";

export type User<T> = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profession: string;
  country: string;
  verified: boolean;
  role: Role;
  image?: string;
  variables: T;
};

export type UserRegister = User<z.infer<typeof registerSchema>>;
export type UserLogin = User<z.infer<typeof loginSchema>>;
