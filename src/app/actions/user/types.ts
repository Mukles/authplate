import { z } from "zod";
import { loginSchema, registerSchema } from "./schema";

export type UserRegister = {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image?: string;
  variables: z.infer<typeof registerSchema>;
};

export type UserLogin = {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  image?: string;
  variables: z.infer<typeof loginSchema>;
};
