import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { currentPwd, newPwd } = await req.json();

        if (!currentPwd || !newPwd) {
            return NextResponse.json(
                { msg: "Champs requis manquants" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!user) {
            return NextResponse.json({ msg: "Utilisateur non trouvé" }, { status: 404 });
        }

        // si tu stockes les mots de passe en clair (temporairement)
        if (user.pwd !== currentPwd) {
            return NextResponse.json({ msg: "Mot de passe actuel incorrect" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { pwd: newPwd },
        });

        return NextResponse.json({
            msg: "Mot de passe mis à jour avec succès",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Erreur lors du changement de mot de passe :", error);
        return NextResponse.json(
            { msg: "Erreur interne du serveur", error: error instanceof Error ? error.message : "Unknown error" },
             { status: 500 }
        );
    }
}
