import { authOptions } from "@/lib/auth-option";
import NextAuth from "next-auth";

export const { handlers, auth, signIn } = NextAuth(authOptions);
