import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { name, username, pwd } = await req.json();

        if (!username || !pwd) {
            return NextResponse.json(
                { msg: "Username and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return NextResponse.json(
                { msg: "Username already taken" },
                { status: 409 }
            );
        }

        // Hash du mot de passe
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // Création du nouvel utilisateur
        const newUser = await prisma.user.create({
            data: {
                name: name || "Utilisateur",
                username,
                pwd: hashedPwd,
                level: 1,
                role: "user",
            },
        });

        return NextResponse.json({
            msg: "User created successfully",
            user: { id: newUser.id, username: newUser.username },
        });
    } catch (error: any) {
        console.error("Erreur /api/auth/signup :", error);
        return NextResponse.json(
            { msg: "Signup failed", error: error.message },
            { status: 500 }
        );
    }
}
