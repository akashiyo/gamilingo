import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//
// GET all words OR filtered
// Supports:
// - /api/words
// - /api/words?category=2
// - /api/words?theme=Food
// - /api/words?category=2&theme=Food
//
export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const theme = searchParams.get("theme");

    const filters: any = {};

    // 🔥 FIXED: convert category string → number
    if (category) {
      const categoryNumber = Number(category);

      if (isNaN(categoryNumber)) {
        return NextResponse.json(
          { msg: "Invalid category value (must be a number)" },
          { status: 400 }
        );
      }

      filters.category = categoryNumber;
    }

    // theme can stay string
    if (theme) filters.theme = theme;

    const words = await prisma.word.findMany({
      where: filters,
    });

    // convert image Buffer to base64 so the client can display it
    const serialized = words.map((w) => ({
      ...w,
      img: w.img ? Buffer.from(w.img).toString("base64") : null,
    }));

    return NextResponse.json({ words: serialized || [] });
  } catch (error: any) {
    console.error("API FILTER ERROR:", error);
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
    const { en, fr, category, definition, img, theme } = await req.json();

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
        img: img ? Buffer.from(img, "base64") : undefined,
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
