"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LogIn, AlertTriangle, Loader2, School } from "lucide-react"; // Ícones adicionados

export default function EscolherEscola() {
  const [escolaId, setEscolaId] = useState("");
  const [escola, setEscola] = useState<any>(null); // Idealmente, defina um tipo para 'escola'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleBuscarEscola = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEscola(null); // Limpa a escola anterior ao buscar uma nova

    // Simulação de chamada API (substitua pelo seu fetch real)
    // await new Promise(resolve => setTimeout(resolve, 1500)); 

    try {
      const res = await fetch(`/api/escolas/${escolaId}`); // Substitua pela sua URL de API
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) { // Verifique se os dados esperados existem
          setEscola(data);
        } else {
          // Se a API retorna 200 OK mas sem os dados esperados
          setError("Formato de dados da escola inválido.");
          setEscola(null);
        }
      } else {
        let errorMessage = "Instituição não encontrada ou ID inválido.";
        try {
            const errorData = await res.json();
            if (errorData && errorData.message) {
                errorMessage = errorData.message;
            }
        } catch (jsonError) {
            // Se o corpo do erro não for JSON ou estiver vazio
        }
        setError(errorMessage);
        setEscola(null);
      }
    } catch (fetchError) {
      console.error("Erro ao buscar escola:", fetchError);
      setError("Erro ao conectar com o servidor. Tente novamente.");
      setEscola(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEntrar = () => {
    if (escola && escola.id) {
      router.push(`/escola/cadastrar?escolaId=${escola.id}`); // Use o ID da escola encontrada
    }
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <header className="py-6 px-4 md:px-6 text-center row-start-1 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-900 dark:text-sky-100 mb-2">Passaporte Acadêmico On-Chain</h1>
        <p className="text-sky-700 dark:text-sky-300 max-w-2xl mx-auto">Verificação de Instituição</p>
      </header>

      <main className="flex items-center justify-center p-4 md:p-8 row-start-2">
        <Card className="w-full max-w-md shadow-lg border-sky-100 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto bg-sky-100 dark:bg-blue-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <School className="h-8 w-8 text-sky-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl text-sky-900 dark:text-sky-100">Identificar Instituição</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Digite o ID fornecido para sua instituição para prosseguir.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <form onSubmit={handleBuscarEscola} className="space-y-4">
              <div>
                <Label htmlFor="escolaId" className="block text-sky-900 dark:text-sky-100 font-medium mb-1">
                  ID da Instituição
                </Label>
                <Input
                  id="escolaId"
                  type="text" // Mudei para text para aceitar IDs com zeros à esquerda ou alfanuméricos
                  value={escolaId}
                  onChange={e => setEscolaId(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border-sky-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sky-900 dark:text-sky-100 placeholder:text-sky-400 dark:placeholder:text-gray-500"
                  placeholder="Ex: 1"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                disabled={isLoading || !escolaId.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar Instituição
                  </>
                )}
              </Button>
            </form>

            {/* Resultado da Busca e Erro */}
            {error && !isLoading && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-md flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {escola && !error && !isLoading && (
              <div className="mt-6 pt-6 border-t border-sky-200 dark:border-gray-700 space-y-4">
                <h3 className="text-lg font-semibold text-sky-800 dark:text-sky-200">Instituição Encontrada:</h3>
                <div className="space-y-2 text-sm bg-sky-50 dark:bg-gray-800 p-4 rounded-md border border-sky-100 dark:border-gray-700">
                  <p>
                    <span className="font-medium text-sky-700 dark:text-sky-300">Nome:</span>
                    <span className="ml-2 text-sky-900 dark:text-sky-100">{escola.nome || "N/A"}</span>
                  </p>
                  <p>
                    <span className="font-medium text-sky-700 dark:text-sky-300">ID:</span>
                    <span className="ml-2 text-sky-900 dark:text-sky-100">{escola.id || "N/A"}</span>
                  </p>
                  {/* Adicione outros campos relevantes da escola aqui, se houver */}
                  {/* Ex: <p><span className="font-medium">Endereço:</span> {escola.endereco}</p> */}
                </div>
                <Button
                  onClick={handleEntrar}
                  className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Prosseguir com esta Instituição
                </Button>
              </div>
            )}
          </CardContent>
          
          {/* O CardFooter pode ser usado para links ou notas adicionais */}
          <CardFooter className="pt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center w-full">
              Caso não encontre sua instituição ou tenha problemas, entre em contato com o suporte.
            </p>
          </CardFooter>
        </Card>
      </main>

      <footer className="py-4 px-4 text-center text-sm text-sky-600 dark:text-sky-200 dark:bg-gray-950/80 row-start-3">
        <p>© {new Date().getFullYear()} Passaporte Acadêmico On-Chain • Todos os direitos reservados</p>
      </footer>
    </div>
  );
}