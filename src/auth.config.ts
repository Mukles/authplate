import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";

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
    async signIn({ user, credentials, account, profile }) {
      // const outestProvider = account?.provider;
      // const email = user.email;
      // console.log({ credentials, profile, account, user });
      // // Find or create the user in the database
      // let dbUser = await prisma.user.findUnique({
      //   where: { email: email as string },
      // });
      // if (!dbUser) {
      //   dbUser = await prisma.user.create({
      //     data: {
      //       email: email,
      //       name: user.name,
      //       image: user.image,
      //     },
      //   });
      // }
      // return true;
    },
    jwt({ token, user, profile }) {
      return token;
    },

    session({ session }) {
      return session;
    },
  },
} satisfies NextAuthConfig;
