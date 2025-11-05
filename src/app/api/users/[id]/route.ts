import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//
// GET one user
//
export const GET = async (_req: Request, { params }: { params: { id: string } }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json(
      { msg: "Failed to retrieve the user", error: error.message },
      { status: 500 }
    );
  }
};

//
// PUT (update user)
//
export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { name, role, level } = await req.json();

    if (!name && !role && !level) {
      return NextResponse.json(
        { msg: "No fields to update provided" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(params.id) },
      data: { name, role, level },
    });

    return NextResponse.json({
      msg: `User ${params.id} updated successfully`,
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { msg: "Failed to update the user", error: error.message },
      { status: 500 }
    );
  }
};

//
// DELETE (remove user)
//
export const DELETE = async (_req: Request, { params }: { params: { id: string } }) => {
  try {
    await prisma.user.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({
      msg: `User with id ${params.id} deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { msg: "Failed to delete the user", error: error.message },
      { status: 500 }
    );
  }
};
