import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//
// GET one user
//
export const GET = async (_req, { params }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    // Convertir l'image en Base64 si elle existe
    let imageBase64 = null;
    if (user.img) {
      imageBase64 = Buffer.from(user.img).toString("base64");
    }

    return NextResponse.json({
      user: {
        ...user,
        img: imageBase64, // en Base64, plus propre !
      },
    });
  } catch (error) {
    return NextResponse.json(
        { msg: "Failed to retrieve the user", error: error.message },
        { status: 500 }
    );
  }
};


//
// PUT (update user) ✅ VERSION CORRIGÉE POUR FORM DATA
//
export const PUT = async (req, { params }) => {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const username = formData.get("username");
    const email = formData.get("email");
    const imageFile = formData.get("img");

    let imgBuffer = undefined;
    if (imageFile && typeof imageFile.arrayBuffer === "function") {
      const arrayBuffer = await imageFile.arrayBuffer();
      imgBuffer = Buffer.from(arrayBuffer);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(params.id) },
      data: {
        name: name || undefined,
        username: username || undefined,
        email: email || undefined,
        ...(imgBuffer && { img: imgBuffer }),
      },
    });

    return NextResponse.json({
      msg: `User ${params.id} updated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur PUT user :", error);
    return NextResponse.json(
        { msg: "Failed to update the user", error: error.message },
        { status: 500 }
    );
  }
};

//
// DELETE (remove user)
//
export const DELETE = async (_req, { params }) => {
  try {
    await prisma.user.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({
      msg: `User with id ${params.id} deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json(
        { msg: "Failed to delete the user", error: error.message },
        { status: 500 }
    );
  }
};
