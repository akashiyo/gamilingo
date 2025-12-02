import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

// Helper to extract userId from JWT token in cookies
function getUserIdFromRequest(req: Request): number | null {
  const cookie = req.headers.get("cookie") || "";
  const tokenMatch = cookie.match(/token=([^;]+)/);
  if (!tokenMatch) return null;

  try {
    const payload = jwt.verify(tokenMatch[1], SECRET) as { id: number };
    return Number(payload.id);
  } catch {
    return null;
  }
}

// GET: Retrieve all known words for the authenticated user
export async function GET(req: Request) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const wordStatuses = await prisma.userWordStatus.findMany({
      where: { userId },
      include: { word: true },
    });

    return NextResponse.json(wordStatuses, { status: 200 });
  } catch (error) {
    console.error("Error fetching word statuses:", error);
    return NextResponse.json({ msg: "Failed to fetch word statuses." }, { status: 500 });
  }
}

// POST: Record a game win for a specific word (increments wins, marks known at 3 wins)
export async function POST(req: Request) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { wordId } = body;

    if (!wordId) {
      return NextResponse.json({ msg: "wordId is required" }, { status: 400 });
    }

    // Check if the word exists
    const word = await prisma.word.findUnique({ where: { id: wordId } });
    if (!word) {
      return NextResponse.json({ msg: "Word not found" }, { status: 404 });
    }

    // Get or create the user's status for this word
    const existingStatus = await prisma.userWordStatus.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });

    let updatedStatus;

    if (existingStatus) {
      // Increment wins and check if user now knows the word (3+ wins)
      const newWins = existingStatus.wins + 1;
      const isNowKnown = newWins >= 3;

      updatedStatus = await prisma.userWordStatus.update({
        where: { userId_wordId: { userId, wordId } },
        data: {
          wins: newWins,
          known: isNowKnown,
        },
      });
    } else {
      // Create new status with 1 win
      updatedStatus = await prisma.userWordStatus.create({
        data: {
          userId,
          wordId,
          wins: 1,
          known: false, // Not known until 3 wins
        },
      });
    }

    return NextResponse.json({
      msg: updatedStatus.known ? "Word is now known!" : "Win recorded!",
      status: updatedStatus,
    }, { status: 200 });
  } catch (error) {
    console.error("Error saving word status:", error);
    return NextResponse.json({ msg: "Failed to save status." }, { status: 500 });
  }
}
