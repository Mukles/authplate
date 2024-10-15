import { z } from "zod";
import { registerSchema } from "./schema";

export type UserRegister = {
  email: string;
  password: string;
  name: string;
  phone: string;
  image: string;
  variables: z.infer<typeof registerSchema>;
};
