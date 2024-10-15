import { loginUser } from "@/actions/user";
import { NextAuthConfig, User } from "next-auth";
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
        const { email, password } = credentials;
        const { data, isError } = await loginUser({
          email: email as string,
          password: password as string,
        });
        if (isError) {
          return null;
        }
        return data as User;
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
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        token.firstName = session.first_name;
        token.lastName = session.last_name;
        token.image = session.image;
        token.isPasswordExit = session.isPasswordExit;
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
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
