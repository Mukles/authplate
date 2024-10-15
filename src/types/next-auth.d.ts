import "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    email: string;
    image: string;
    id: string;
    accessToken: string;
    firstName: string;
    lastName?: string;
    expiredAt: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    email: string;
    image: string;
    id: string;
    accessToken: string;
    firstName: string;
    lastName?: string;
    expiredAt: number;
  }
}
