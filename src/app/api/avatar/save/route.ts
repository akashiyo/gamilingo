import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, eyes, mouth, hair, hat, top, ears } = body;

        // Si l’utilisateur a déjà un avatar → update
        const existing = await prisma.avatar.findUnique({
            where: { userId },
        });

        if (existing) {
            await prisma.avatar.update({
                where: { userId },
                data: { eyes, mouth, hair, hat, top, ears }
            });
        } else {
            // Sinon → création
            await prisma.avatar.create({
                data: { userId, eyes, mouth, hair, hat, top, ears }
            });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

}
export async function GET(
    req: Request,
    { params }: { params: { userId: string } }
) {
    const userId = Number(params.userId);

    const avatar = await prisma.avatar.findUnique({
        where: { userId }
    });

    return NextResponse.json({ avatar });
}