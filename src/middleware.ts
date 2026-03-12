import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Check for Better Auth session cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
