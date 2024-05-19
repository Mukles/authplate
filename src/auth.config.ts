import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prismaClient";
import { loginSchema } from "./schema/userSchema";

export default {
  providers: [
    Credentials({
      async authorize(credentials, request) {
        const validate = loginSchema.safeParse(credentials);
        if (validate.success) {
          const { email, password } = validate.data;
          await prisma.$connect();
          const user = await prisma.user.findUnique({ where: { email } });
          const passwordMatch = await bcrypt.compare(password, user?.password!);

          if (passwordMatch) {
            return user;
          }
          return null;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
