import { loginUser, updateUser } from "@/actions/user";
import { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { v4 as uuidv4 } from "uuid";

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
      profile(profile) {
        const userId = uuidv4();
        const { given_name, family_name, email, picture } = profile;
        profile.firstName = given_name;
        profile.lastName = family_name;
        profile.email = email;
        profile.image = picture;
        profile.userId = userId;
        return profile;
      },
    }),
  ],
  debug: process.env.NODE_ENV !== "development",
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  pages: {
    signIn: "/signin",
    newUser: "/signup",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        const { firstName, lastName, email, userId, image } = user;
        const { data: dbUser } = await updateUser({
          userId,
          firstName,
          lastName,
          provider: "google",
          email: email!,
          image: image!,
          isTermsAccepted: true,
        });

        if (!dbUser) {
          return false;
        }
        user.email = dbUser?.email;
        user.userId = dbUser?.userId!;
        user.firstName = dbUser?.firstName;
        user.lastName = dbUser?.lastName;
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
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.userId = user.userId;
        if (user.image) {
          token.image = user.image;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        const { email, firstName, lastName, image, userId } = token;
        const user = session.user;
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.image = image;
        user.userId = userId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
