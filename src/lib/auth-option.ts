import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";

export const authOptions = {
  providers: [
    Credentials({
      name: "credentials",
      id: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      type: "credentials",
      async authorize(credentials) {
        return {};
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  debug: false,
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    newUser: "/register",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (["oauth", "oidc"].includes(account?.type!)) {
        const { data: dbUser } = await updateUserProfile({
          ...user,
          provider: account?.provider,
        });

        if (!dbUser) {
          return false;
        }

        user.email = dbUser.email;
        user.id = dbUser.id;
        user.accessToken = dbUser.accessToken;
        user.expiredAt = dbUser.expiredAt;
        user.firstName = dbUser.firstName;
        user.lastName = dbUser.lastName;
        return true;
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        token.firstName = session.first_name;
        token.lastName = session.last_name;
        token.image = session.image;
        token.isPasswordExit = session.isPasswordExit;
      }

      if (user) {
        token.email = user.email!;
        token.id = user.id!;
        token.accessToken = user.accessToken;
        token.expiredAt = user.expiredAt;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image!;
        token.isPasswordExit = user.isPasswordExit;
      }

      if (token.expiredAt && new Date(token.expiredAt).getTime() < Date.now()) {
        return null;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        const {
          accessToken,
          expiredAt,
          email,
          id,
          firstName,
          lastName,
          isPasswordExit,
        } = token;

        session.user.email = email!;
        session.user.id = id;
        session.user.accessToken = accessToken;
        session.user.expiredAt = expiredAt;
        session.user.firstName = firstName;
        session.user.lastName = lastName;
        session.user.image = token.image;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
