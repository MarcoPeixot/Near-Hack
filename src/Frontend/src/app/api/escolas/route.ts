import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const escolas = await prisma.escola.findMany()
  return NextResponse.json(escolas)
}
