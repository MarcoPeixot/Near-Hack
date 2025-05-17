import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const escola = await prisma.escola.create({
      data: {
        nome: data.nome,
        tipo: data.tipo,
        endereco: data.endereco,
        cidade: data.cidade,
        estado: data.estado,
        lat: data.lat,
        lng: data.lng,
        walletAddress: data.walletAddress,
      },
    })
    return NextResponse.json(escola, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
