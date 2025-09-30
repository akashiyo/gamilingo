import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//
// GET all words
//
export const GET = async () => {
  try {
    const words = await prisma.word.findMany();
    return NextResponse.json({ words: words || [] }); // if no words in the database yet, retrurn empty array to dodge parsing error
  } catch (error: any) {
    return NextResponse.json(
      { msg: "Failed to retrieve words", error: error.message },
      { status: 500 }
    );
  }
};

//
// POST (create a new word)
//
export const POST = async (req: Request) => {
  try {
    const { en, fr, category, definition, img , theme} = await req.json();

    if (!en || !fr) {
      return NextResponse.json(
        { msg: "Both 'en' and 'fr' fields are required" },
        { status: 400 }
      );
    }

    const newWord = await prisma.word.create({
      data: {
        en,
        fr,
        category: category ?? 1,
        definition,
        img: img ? Buffer.from(img, "base64") : undefined, // image en base64
        theme,
      },
    });

    return NextResponse.json({
      msg: "Word created successfully",
      word: newWord,
    });
  } catch (error: any) {
    return NextResponse.json(
      { msg: "Failed to create the word", error: error.message },
      { status: 500 }
    );
  }
};
