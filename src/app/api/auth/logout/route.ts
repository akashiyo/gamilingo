import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  
  // Also set the cookie to empty with maxAge 0 for extra safety
  cookieStore.set({
    name: "token",
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return NextResponse.json({ msg: "Logged out successfully" });
}
