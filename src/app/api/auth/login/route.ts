import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, pwd } = await req.json();

    // Vérifie que les deux champs sont bien fournis
    if (!username || !pwd) {
      return NextResponse.json(
          { msg: "Username and password are required" },
          { status: 400 }
      );
    }

    // Recherche de l'utilisateur
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

     // Vérifie le mot de passe (bcrypt)
    //const valid = await bcrypt.compare(pwd, user.pwd);
    const valid = user.pwd === pwd; // ⚠️ uniquement pour tester sans hash

    if (!valid) {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 401 });
    }

    // Génération du token JWT
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "default_secret_key", // ⚠️ pense à mettre une vraie clé dans ton .env
        { expiresIn: "10h" }
    );

    // Création du cookie sécurisé
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 10 * 60 * 60, // 10 hours
    });

    // Réponse JSON avec les infos utiles
    return NextResponse.json({
      msg: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        level: user.level,
        xp: user.xp,
      },
    });
  } catch (error: any) {
    console.error("Erreur dans /api/auth/login :", error);
    return NextResponse.json(
        { msg: "Login failed", error: error.message },
        { status: 500 }
    );
  }
}
