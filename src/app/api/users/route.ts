import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//
// GET all users
//
export const GET = async () => {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json(
      { msg: "Failed to retrieve users", error: error.message },
      { status: 500 }
    );
  }
};

//
// POST (create a new user)
//
export const POST = async (req: Request) => {
  try {
    const { name, username, pwd, role } = await req.json();

    if (!name || !username || !pwd || !role) {
      return NextResponse.json(
        { msg: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { msg: "User with this username already exists" },
        { status: 409 }
      );
    }

    const newUser = await prisma.user.create({
      data: { name, username, pwd, role },
    });

    return NextResponse.json({
      msg: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { msg: "Failed to create the user", error: error.message },
      { status: 500 }
    );
  }
};
