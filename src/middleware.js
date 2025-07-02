import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Securely get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes that require authentication
  const protectedRoutes = ["/profile", "/dashboard", "/new-feature"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Log the user and URL for debugging
  console.log(
    "Path:",
    req.nextUrl.pathname,
    "User:",
    user ? "Yes" : "No"
  );

  // If on protected route and not authenticated, redirect to login
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("returnUrl", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If on auth pages and already authenticated, redirect to dashboard
  if (
    (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup") &&
    user
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/projects/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
