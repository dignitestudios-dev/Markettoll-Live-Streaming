import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_REDIRECT,
  DEFAULT_REDIRECT,
  PROTECTED_ROUTES,
} from "@/config/routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute =
    pathname.startsWith("/auth") ||
    pathname === "/login" ||
    pathname === "/register";

  // If user is already logged in and tries to access ANY auth route (/auth/*, /login, /register), redirect to home page "/"
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }

  // If route is protected and user is not logged in, redirect to login page
  if (isProtected && !token) {
    const redirectUrl = new URL(AUTH_REDIRECT, request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
