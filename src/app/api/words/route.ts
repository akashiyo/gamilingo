import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// detect mime type (png or jpeg) from the image Buffer/Uint8Array
function detectImageMime(buf: Uint8Array | Buffer | null | undefined): string | null {
  if (!buf) return null;
  const b = Buffer.from(buf as Uint8Array);
  // JPEG magic bytes: 0xFF 0xD8 0xFF
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  if (
    b.length >= 8 &&
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47 &&
    b[4] === 0x0d &&
    b[5] === 0x0a &&
    b[6] === 0x1a &&
    b[7] === 0x0a
  )
    return "image/png";

  return null;
}

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

    // convert category string → number
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

    // convert image Buffer to base64 so the client can display it and include detected mime
    const serialized = words.map((w) => ({
      ...w,
      img: w.img ? Buffer.from(w.img).toString("base64") : null,
      imgMime: w.img ? detectImageMime(w.img) : null,
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
