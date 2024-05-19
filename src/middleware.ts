import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

const publicUrl = ["/signin", "/signup", "/verify", "/forgot-password"];

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuth = !!req.auth;
  const pathname = nextUrl.pathname;
  const origin = nextUrl.origin;

  if (publicUrl.some((u) => pathname.startsWith(u))) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", origin));
    } else {
      return NextResponse.next();
    }
  }
  if (!isAuth) {
    return NextResponse.redirect(new URL(`/signin?from=${pathname}`, origin));
  }
});

export const config = {
  matcher: ["/signin", "/signup/", "/"],
};
