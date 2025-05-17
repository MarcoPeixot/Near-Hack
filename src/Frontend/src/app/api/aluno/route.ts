import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // 1. Cria carteira na LUMX
    const lumxRes = await fetch(process.env.NEXT_PUBLIC_LUMX_API_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LUMX_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "individual",
        name: data.nome,
        taxId: data.cpf,
        birthDate: data.dataNascimento,
        country: "BRA",
        email: data.email,
      }),
    });

    if (!lumxRes.ok) {
      const error = await lumxRes.text();
      return NextResponse.json({ error: "Erro ao criar carteira: " + error }, { status: 400 });
    }

    const carteira = await lumxRes.json();
    const walletAddress = carteira.walletAddress || carteira.address || "";

    // 2. Cria aluno no banco já com walletAddress
    const aluno = await prisma.aluno.create({
      data: {
        nome: data.nome,
        cpf: data.cpf,
        email: data.email,
        dataNascimento: new Date(data.dataNascimento),
        walletAddress,
        escolaId: data.escolaId,
      },
    });

    return NextResponse.json(aluno, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cpf = searchParams.get("cpf")
  if (!cpf) return NextResponse.json({ error: "CPF não informado" }, { status: 400 })

  const aluno = await prisma.aluno.findUnique({ where: { cpf } })
  if (!aluno) return NextResponse.json(null, { status: 200 })
  return NextResponse.json(aluno)
}


// PATCH: Atualiza escolaId ou dados do aluno
export async function PATCH(req: NextRequest) {
  try {
    const { id, escolaId, ...rest } = await req.json();

    // Busca aluno pelo id
    const aluno = await prisma.aluno.findUnique({ where: { id } });
    if (!aluno) return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 });

    // Caso 2: Atualizar apenas escolaId se for diferente
    if (escolaId && aluno.escolaId !== escolaId && Object.keys(rest).length === 0) {
      const atualizado = await prisma.aluno.update({
        where: { id },
        data: { escolaId },
      });
      return NextResponse.json(atualizado);
    }

    // Caso 3: Rematrícula (escolaId igual, pode atualizar outros campos)
    if (escolaId && aluno.escolaId === escolaId) {
      const atualizado = await prisma.aluno.update({
        where: { id },
        data: { ...rest },
      });
      return NextResponse.json(atualizado);
    }

    // Caso padrão: erro
    return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}