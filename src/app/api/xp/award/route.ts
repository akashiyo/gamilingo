import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const SECRET = process.env.JWT_SECRET || "default_secret_key";

// XP config
const XP_PER_GAME = 50; // fixed per requirements

// compute thresholds based on 5 themes per level, 3 games per theme
const THEMES_PER_LEVEL = 5;
const GAMES_PER_THEME = 3;
const XP_PER_LEVEL = THEMES_PER_LEVEL * GAMES_PER_THEME * XP_PER_GAME; // 5*3*50 = 750

function computeLevelFromXp(xp: number) {
  if (xp >= XP_PER_LEVEL * 2) return 3; // >=1500
  if (xp >= XP_PER_LEVEL * 1) return 2; // >=750
  return 1;
}

export const POST = async (req: Request) => {
  try {
    const cookie = req.headers.get("cookie") || "";
    const token = cookie.split("token=")?.[1];
    if (!token) return NextResponse.json({ msg: "Not authenticated" }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, SECRET);
    } catch (e) {
      return NextResponse.json({ msg: "Invalid token" }, { status: 401 });
    }

    const userId = Number(payload.id);
    const body = await req.json();
    const { game, level, theme, xp = XP_PER_GAME } = body;

    if (!game || !level) {
      return NextResponse.json({ msg: "Missing game or level" }, { status: 400 });
    }

    // check existing award for same user/game/level/theme
    const existing = await prisma.userAward.findFirst({
      where: { userId, game, level: Number(level), theme: theme || null },
    });

    if (existing) {
      return NextResponse.json({ awarded: false, reason: "already_awarded" });
    }

    // create award and update user xp atomically
    const awardedXp = Number(xp);

    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.userAward.create({
        data: { userId, game, level: Number(level), theme: theme || null, xp: awardedXp },
      });

      const user = await tx.user.update({
        where: { id: userId },
        data: { xp: { increment: awardedXp } as any },
      });

      // recompute level
      const newLevel = computeLevelFromXp(user.xp);
      if (newLevel !== user.level) {
        await tx.user.update({ where: { id: userId }, data: { level: newLevel } });
        user.level = newLevel;
      }

      return user;
    });

    return NextResponse.json({ awarded: true, xp: updatedUser.xp, level: updatedUser.level });
  } catch (error: any) {
    console.error("award error", error);
    return NextResponse.json({ msg: "Failed to award xp", error: error.message }, { status: 500 });
  }
};

export default POST;
