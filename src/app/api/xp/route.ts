import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const SECRET = process.env.JWT_SECRET || "default_secret_key";

export const GET = async (req: Request) => {
  try {
    const token = req.headers.get("cookie")?.split("token=")?.[1];

    if (!token) return NextResponse.json({ msg: "Not authenticated" }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, SECRET);
    } catch (e) {
      return NextResponse.json({ msg: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: Number(payload.id) } });
    if (!user) return NextResponse.json({ msg: "User not found" }, { status: 404 });

    return NextResponse.json({ id: user.id, xp: user.xp, level: user.level });
  } catch (error: any) {
    return NextResponse.json({ msg: "Failed to fetch xp", error: error.message }, { status: 500 });
  }
};

export default GET;
