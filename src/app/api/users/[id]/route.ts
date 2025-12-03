import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

//
// GET one user
//
export const GET = async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
        { msg: "Failed to retrieve the user", error: errorMessage },
        { status: 500 }
    );
  }
};


//
// PUT (update user) ✅ VERSION CORRIGÉE POUR FORM DATA
//
export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const username = formData.get("username") as string | null;
    const email = formData.get("email") as string | null;
    const imageFile = formData.get("img") as File | null;

    let imgBuffer: Buffer | undefined = undefined;
    if (imageFile && typeof imageFile.arrayBuffer === "function") {
      const arrayBuffer = await imageFile.arrayBuffer();
      imgBuffer = Buffer.from(arrayBuffer);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name: name || undefined,
        username: username || undefined,
        email: email || undefined,
        ...(imgBuffer && { img: imgBuffer }),
      },
    });

    return NextResponse.json({
      msg: `User ${id} updated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur PUT user :", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
        { msg: "Failed to update the user", error: errorMessage },
        { status: 500 }
    );
  }
};

//
// DELETE (remove user)
//
export const DELETE = async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      msg: `User with id ${id} deleted successfully`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
        { msg: "Failed to delete the user", error: errorMessage },
        { status: 500 }
    );
  }
};
