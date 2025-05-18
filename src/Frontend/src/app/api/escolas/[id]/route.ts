import { NextRequest, NextResponse } from "next/server"; // Importe NextRequest também
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest, // É uma boa prática usar NextRequest
  context: { params: { id: string } } // <--- CORRIGIDO: Este é o objeto de contexto
) {
  // Extrai o id dos parâmetros da rota
  const idFromParams = context.params.id;

  // Converte o ID para número, pois o ID na URL é uma string
  const id = Number(idFromParams);

  // Validação se o ID é um número válido
  if (isNaN(id)) {
    return NextResponse.json(
      { error: "ID inválido. O ID deve ser um número." },
      { status: 400 }
    );
  }

  try {
    const escola = await prisma.escola.findUnique({
      where: { id: id }, // Certifique-se de que o campo 'id' no seu schema do Prisma é um Int
    });

    if (!escola) {
      return NextResponse.json(
        { error: "Escola não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(escola);
  } catch (error) {
    console.error("Erro ao buscar escola:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a solicitação" },
      { status: 500 }
    );
  }
}