import "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    userId: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    image?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    image?: string;
  }
}
