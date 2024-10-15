import { authOptions } from "@/lib/auth-option";
import NextAuth from "next-auth";

export const { handlers, auth } = NextAuth(authOptions);
