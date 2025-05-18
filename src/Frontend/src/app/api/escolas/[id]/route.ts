import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Versão simplificada sem tipagem explícita no segundo parâmetro
export async function GET(request, { params }) {
  try {
    // Extrair o ID da escola dos parâmetros da URL
    const id = Number(params.id);
    
    // Verificar se o ID é válido
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido. O ID deve ser um número." },
        { status: 400 }
      );
    }
    
    // Buscar a escola no banco de dados
    const escola = await prisma.escola.findUnique({
      where: { id },
    });
    
    // Se a escola não for encontrada, retornar um erro 404
    if (!escola) {
      return NextResponse.json(
        { error: "Escola não encontrada" },
        { status: 404 }
      );
    }
    
    // Retornar os dados da escola
    return NextResponse.json(escola);
  } catch (error) {
    console.error("Erro ao buscar escola:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a solicitação" },
      { status: 500 }
    );
  }
}