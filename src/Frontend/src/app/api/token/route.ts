// File: app/api/mint-nft-proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const externalApiUrl = process.env.NEXT_PUBLIC_TOKEN_API; // URL da sua API de mintar NFT

  // Verifica se a URL da API externa está configurada
  if (!externalApiUrl) {
    console.error("NEXT_PUBLIC_TOKEN_API (URL da API de NFT) não está definido nas variáveis de ambiente.");
    return NextResponse.json(
      { error: "Configuração do servidor proxy incompleta." },
      { status: 500 }
    );
  }

  try {
    // 1. Ler o corpo da requisição vinda do seu frontend
    // Espera-se que o frontend envie algo como: { "alunoId": 123, "premio": "Nome do Premio" }
    const clientRequestBody = await req.json();

    // Valida se o alunoId foi enviado
    if (!clientRequestBody.alunoId) {
      return NextResponse.json(
        { error: "O campo 'alunoId' é obrigatório no corpo da requisição." },
        { status: 400 }
      );
    }

    // 2. Preparar o corpo da requisição para a API externa
    // Sua API externa espera { "alunoId": ID_DO_ALUNO }
    const bodyForExternalApi = JSON.stringify({
      alunoId: clientRequestBody.alunoId,
      // Se a API externa também esperasse outros campos que você enviou do frontend (ex: nome do prêmio),
      // você os adicionaria aqui. Por exemplo:
      // premioNome: clientRequestBody.premio,
    });

    // 3. Fazer a chamada para a API externa de mintar NFT
    const apiResponse = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Se a sua API externa (NEXT_PUBLIC_TOKEN_API) exigir alguma chave de API ou token de autorização,
        // adicione aqui. Exemplo:
        // "Authorization": `Bearer SEU_TOKEN_PARA_A_API_EXTERNA`
      },
      body: bodyForExternalApi,
    });

    // 4. Processar a resposta da API externa
    const responseContentType = apiResponse.headers.get("Content-Type");
    let responseData;

    // Tenta parsear como JSON se o Content-Type indicar, caso contrário, lê como texto
    if (responseContentType && responseContentType.includes("application/json")) {
      responseData = await apiResponse.json();
    } else {
      responseData = await apiResponse.text();
    }

    // Se a API externa retornou um erro (status não é 2xx)
    if (!apiResponse.ok) {
      console.error(`Erro da API externa (${apiResponse.status}):`, responseData);
      // Se a resposta original não era JSON, mas estamos retornando JSON para o cliente, encapsulamos.
      const errorPayload = (typeof responseData === 'string' && !(responseContentType && responseContentType.includes("application/json")))
                           ? { error: responseData } // Transforma texto de erro em objeto JSON
                           : responseData; // Já é JSON ou erro JSON
      return NextResponse.json(errorPayload, { status: apiResponse.status });
    }

    // Se a API externa retornou sucesso (ex: status 200, 201)
    return NextResponse.json(responseData, { status: apiResponse.status });

  } catch (error: any) {
    // Tratar erros específicos, como corpo JSON malformado vindo do cliente
    if (error instanceof SyntaxError && error.message.toLowerCase().includes("json")) {
      console.error("Erro de parsing do JSON da requisição do cliente:", error.message);
      return NextResponse.json({ error: "Corpo da requisição inválido (não é um JSON válido)." }, { status: 400 });
    }
    // Outros erros (ex: falha de rede ao tentar conectar na API externa, etc.)
    console.error("Erro inesperado no proxy da API de NFT:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor proxy.", details: error.message },
      { status: 500 }
    );
  }
}