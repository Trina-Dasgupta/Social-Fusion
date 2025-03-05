import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  // Define public/auth pages
  const authPages = ["/login", "/register", "/verifyOtp", "/forget-password"];
  const isAuthPage = authPages.includes(pathname);

  // If logged in and trying to access an auth page -> redirect to chat
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  // If not logged in and trying to access a protected page -> redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/verifyOtp", "/forget-password","/chat", "/chat/:path*"], 
};
