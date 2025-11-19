import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { wordId, known } = body;

    if (!wordId || known === undefined) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    // Temporary dummy user until you implement auth
    // const userId = 1;

    // await prisma.userWordStatus.upsert({
    //   where: { userId_wordId: { userId, wordId } },
    //   update: { known },
    //   create: { userId, wordId, known },
    // });

    return NextResponse.json({ message: "Status saved successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error saving word status:", error);
    return NextResponse.json({ message: "Failed to save status." }, { status: 500 });
  }
}
