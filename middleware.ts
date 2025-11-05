import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // 👈 match login cookie
  const protectedPaths = ["/words", "/hangman"]; // protected routes

  if (protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p))) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      jwt.verify(token, SECRET); // throws if invalid
    } catch {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/words/:path*", "/hangman/:path*"],
};
