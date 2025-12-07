import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ----------------------- GET one user ----------------------- */
export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      include: { avatar: true }, // on récupère aussi l'avatar
    });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    // ne jamais renvoyer un Buffer brut dans du JSON
    const imgBase64 = user.img ? Buffer.from(user.img).toString("base64") : null;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        level: user.level,
        role: user.role,
        xp: user.xp,
        avatar: user.avatar ?? null,
        img: imgBase64, // string base64 ou null
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
        { msg: "Failed to retrieve the user", error: msg },
        { status: 500 }
    );
  }
}

/* ----------------------- PUT (update user) ----------------------- */
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const username = formData.get("username") as string | null;
    const email = formData.get("email") as string | null;
    const imageFile = formData.get("img") as File | null;

    let imgBuffer: Buffer | undefined;
    if (imageFile && typeof imageFile.arrayBuffer === "function") {
      imgBuffer = Buffer.from(await imageFile.arrayBuffer());
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: name || undefined,
        username: username || undefined,
        email: email || undefined,
        ...(imgBuffer && { img: imgBuffer }),
      },
      include: { avatar: true },
    });

    const imgBase64 = updated.img
        ? Buffer.from(updated.img).toString("base64")
        : null;

    return NextResponse.json({
      msg: `User ${id} updated successfully`,
      user: {
        id: updated.id,
        name: updated.name,
        username: updated.username,
        email: updated.email,
        level: updated.level,
        role: updated.role,
        xp: updated.xp,
        avatar: updated.avatar ?? null,
        img: imgBase64,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
        { msg: "Failed to update the user", error: msg },
        { status: 500 }
    );
  }
}

/* ----------------------- DELETE (remove user) ----------------------- */
export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ msg: `User ${id} deleted successfully` });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
        { msg: "Failed to delete the user", error: msg },
        { status: 500 }
    );
  }
}
