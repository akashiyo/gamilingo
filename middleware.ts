import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  const protectedPaths = ["/dashboard", "/words"]; // pages requiring login

  if (protectedPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    try {
      jwt.verify(token, SECRET);
    } catch {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/words/:path*"], // paths to protect
};
