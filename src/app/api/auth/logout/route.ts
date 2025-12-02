import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear the JWT cookie named `token`
  res.cookies.set({ name: "token", value: "", maxAge: 0, path: "/" });
  return res;
}

export default POST;
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");

  return NextResponse.json({ msg: "Logged out successfully" });
};
