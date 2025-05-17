import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  const escola = await prisma.escola.findUnique({ where: { id } });
  if (!escola) {
    return NextResponse.json({ error: "Escola não encontrada" }, { status: 404 });
  }
  return NextResponse.json(escola);
}