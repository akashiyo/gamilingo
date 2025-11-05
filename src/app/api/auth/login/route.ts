import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  try {
    const { username, password } = await req.json();

    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.pwd);
    if (!valid) {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({
      msg: "Login successful",
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (error: any) {
    return NextResponse.json(
      { msg: "Login failed", error: error.message },
      { status: 500 }
    );
  }
};
