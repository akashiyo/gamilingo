import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // si tu veux hasher les mots de passe (recommandé)

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    try {
        const { currentPwd, newPwd } = await req.json();

        if (!currentPwd || !newPwd) {
            return NextResponse.json(
                { msg: "Champs requis manquants" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(params.id) },
        });

        if (!user) {
            return NextResponse.json({ msg: "Utilisateur non trouvé" }, { status: 404 });
        }

        // si tu stockes les mots de passe en clair (temporairement)
        if (user.pwd !== currentPwd) {
            return NextResponse.json({ msg: "Mot de passe actuel incorrect" }, { status: 400 });
        }

        // si tu veux sécuriser (recommandé) :
        // const validPwd = await bcrypt.compare(currentPwd, user.pwd);
        // if (!validPwd) return NextResponse.json({ msg: "Mot de passe actuel incorrect" }, { status: 400 });

        const updatedUser = await prisma.user.update({
            where: { id: Number(params.id) },
            data: { pwd: newPwd }, // ou data: { pwd: await bcrypt.hash(newPwd, 10) }
        });

        return NextResponse.json({
            msg: "Mot de passe mis à jour avec succès",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Erreur lors du changement de mot de passe :", error);
        return NextResponse.json(
            { msg: "Erreur interne du serveur", error: error.message },
             { status: 500 }
        );
    }
}
