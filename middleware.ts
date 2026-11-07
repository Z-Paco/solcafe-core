import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { user, supabaseResponse } = await updateSession(req);

  const protectedRoutes = ["/profile", "/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("returnUrl", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (req.nextUrl.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return supabaseResponse;
}

export const config = {
  // Every page, so a refreshed Supabase session is always saved (Server
  // Components cannot write cookies). Static assets and images are skipped.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
