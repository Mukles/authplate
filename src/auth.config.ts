import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import prisma from "./lib/prismaClient";

export default {
  providers: [
    Credentials({}),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    newUser: "/signup",
  },
  callbacks: {
    async signIn({ account, user, credentials, profile }) {
      console.log(profile);
      return false;
    },
    jwt({ token, user, profile }) {
      return token;
    },
    session({ session }) {
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      console.log({ user });
      await prisma.$connect();

      await prisma.user.create({
        data: {
          first_name: "mukles",
          last_name: "hossen",
          email: user.email as string,
          image: user.image as string,
          isTermsAccepted: true,
        },
      });
    },
  },
} satisfies NextAuthConfig;
