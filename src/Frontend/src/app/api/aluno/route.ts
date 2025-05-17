import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const aluno = await prisma.aluno.create({
      data: {
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        dataNascimento: new Date(data.dataNascimento),
        walletAddress: data.walletAddress,
        escolaId: data.escolaId,
      },
    })
    return NextResponse.json(aluno, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
