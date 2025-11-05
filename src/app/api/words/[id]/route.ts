import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//
// GET one word
//
export const GET = async (_req: Request, { params }: { params: { id: string } }) => {
  try {
    const word = await prisma.word.findUnique({
      where: { id: Number(params.id) },
    });

    if (!word) {
      return NextResponse.json({ msg: "Word not found" }, { status: 404 });
    }

    // image object convert into base64
    const serializedWord = {
      ...word,
      img: word.img ? Buffer.from(word.img).toString("base64") : null,
    };

    // return serialized word (with base64 image)
    return NextResponse.json({ word: serializedWord });
  } catch (error: any) {
    return NextResponse.json(
      { msg: "Failed to retrieve the word", error: error.message },
      { status: 500 }
    );
  }
};

//
// PUT (update word)
//
export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  try {
    const { en, fr, category, definition, img, theme } = await req.json();

    const updatedWord = await prisma.word.update({
      where: { id: Number(params.id) },
      data: {
        en,
        fr,
        category,
        definition,
        img: img ? Buffer.from(img, "base64") : undefined,
        theme,
      },
    });

    return NextResponse.json({
      msg: `Word ${params.id} updated successfully`,
      word: updatedWord,
    });
  } catch (error: any) {
    return NextResponse.json(
      { msg: "Failed to update the word", error: error.message },
      { status: 500 }
    );
  }
};

//
// DELETE (remove word)
//
export const DELETE = async (_req: Request, { params }: { params: { id: string } }) => {
  try {
    await prisma.word.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({
      msg: `Word with id ${params.id} deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { msg: "Failed to delete the word", error: error.message },
      { status: 500 }
    );
  }
};
