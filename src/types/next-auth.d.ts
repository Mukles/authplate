import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      email: string;
      stripe_customer_id: string;
      isActive: boolean;
      stripe_subscription_id: string;
      verified: boolean;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface User {}
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token: string;
    error?: "RefreshAccessTokenError";
  }
}
