"use client";

import { useState, useEffect, Suspense, FormEvent, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, UserPlus, Save, LinkIcon as LinkIconLucide, AlertTriangle, CheckCircle2, UserCog, ArrowLeft } from "lucide-react"; // Ícones atualizados

// Componente interno que usa useSearchParams
function CadastrarEscolaContent() {
  const searchParams = useSearchParams();
  const escolaIdParam = searchParams.get("escolaId");

  const [cpf, setCpf] = useState("");
  const [step, setStep] = useState<"cpf" | "criar-aluno" | "afiliar-escola" | "rematricula">("cpf");
  const [carteiraData, setCarteiraData] = useState({
    nome: "",
    cpf: "",
    aniversario: "", // Formato YYYY-MM-DD
    pais: "BRA",
    email: "",
  });
  const [alunoId, setAlunoId] = useState<number | null>(null);
  const [aluno, setAluno] = useState<any>(null);
  const [escolaId, setEscolaId] = useState<number | null>(
    escolaIdParam ? Number(escolaIdParam) : null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  useEffect(() => {
    if (escolaIdParam) {
      setEscolaId(Number(escolaIdParam));
    } else {
      setEscolaId(null);
      setFormFeedback({ type: 'error', message: "ID da instituição não fornecido na URL. Verifique o link ou retorne e selecione uma instituição." });
    }
  }, [escolaIdParam]);

  const resetFormFeedback = () => setFormFeedback(null);
  const resetFullForm = () => {
    setCpf("");
    setCarteiraData({ nome: "", cpf: "", aniversario: "", pais: "BRA", email: "" });
    setAlunoId(null);
    setAluno(null);
    resetFormFeedback();
  };

  // --- Funções de API (mantidas como no original, mas com try-catch-finally para isLoading e feedback) ---
  const buscarAlunoPorCpf = async (cpfToSearch: string) => {
    const res = await fetch(`/api/aluno?cpf=${cpfToSearch}`);
    if (res.ok) {
      const alunoData = await res.json();
      return alunoData;
    }
    if (res.status === 404) return null; // Aluno não encontrado é um fluxo normal
    const error = await res.json();
    throw new Error(error.error || "Erro ao buscar aluno");
  };

  const criarAluno = async (data: any) => {
    const res = await fetch("/api/aluno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Erro ao criar aluno");
    }
    return await res.json();
  };

  const atualizarAluno = async (id: number, data: any) => {
    const res = await fetch(`/api/aluno`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Erro ao atualizar aluno");
    }
    return await res.json();
  };

  // --- Handlers (lógica mantida, adicionado isLoading e feedback) ---
  const handleCpfSubmit = async (e: FormEvent) => {
    e.preventDefault();
    resetFormFeedback();
    if (!escolaId) {
      setFormFeedback({ type: 'error', message: "ID da instituição não definido. Não é possível prosseguir." });
      return;
    }
    setIsLoading(true);
    try {
      const alunoEncontrado = await buscarAlunoPorCpf(cpf);
      setAluno(alunoEncontrado);
      if (!alunoEncontrado) {
        setCarteiraData((prev) => ({ ...prev, cpf }));
        setStep("criar-aluno");
        setFormFeedback({type: 'success', message: 'CPF não encontrado. Prossiga para criar um novo aluno.'})
      } else if (alunoEncontrado.escolaId !== escolaId) {
        setAlunoId(alunoEncontrado.id);
        setCarteiraData({
          nome: alunoEncontrado.nome || "",
          cpf: alunoEncontrado.cpf,
          aniversario: alunoEncontrado.dataNascimento ? new Date(alunoEncontrado.dataNascimento).toISOString().slice(0, 10) : "",
          pais: "BRA",
          email: alunoEncontrado.email || "",
        });
        setStep("afiliar-escola");
        setFormFeedback({type: 'success', message: `Aluno ${alunoEncontrado.nome} encontrado, mas registrado em outra instituição. Você pode afiliá-lo à instituição atual (ID: ${escolaId}).`})
      } else {
        setAlunoId(alunoEncontrado.id);
        setCarteiraData({
          nome: alunoEncontrado.nome || "",
          cpf: alunoEncontrado.cpf,
          aniversario: alunoEncontrado.dataNascimento ? new Date(alunoEncontrado.dataNascimento).toISOString().slice(0, 10) : "",
          pais: "BRA",
          email: alunoEncontrado.email || "",
        });
        setStep("rematricula");
        setFormFeedback({type: 'success', message: `Aluno ${alunoEncontrado.nome} encontrado e já afiliado a esta instituição. Prossiga para atualizar dados ou rematricular.`})
      }
    } catch (err: any) {
      setFormFeedback({ type: 'error', message: err.message || "Erro ao buscar aluno." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCarteiraChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarteiraData((prev) => ({ ...prev, [name]: value }));
    resetFormFeedback(); // Limpa feedback ao editar campos
  };

  const handleCriarAlunoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    resetFormFeedback();
    if (!escolaId) {
      setFormFeedback({ type: 'error', message: "ID da Instituição é obrigatório para criar aluno." });
      return;
    }
    setIsLoading(true);
    try {
      const alunoCriado = await criarAluno({
        nome: carteiraData.nome,
        cpf: carteiraData.cpf,
        email: carteiraData.email,
        dataNascimento: carteiraData.aniversario ? new Date(carteiraData.aniversario).toISOString() : null,
        escolaId,
      });
      setAlunoId(alunoCriado.id);
      setFormFeedback({ type: 'success', message: "Aluno criado com sucesso! Agora você pode gerenciar a matrícula." });
      setStep("rematricula");
    } catch (err: any) {
      setFormFeedback({ type: 'error', message: err.message || "Erro ao criar aluno." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAfiliarEscolaSubmit = async (e: FormEvent) => {
    e.preventDefault();
    resetFormFeedback();
    setIsLoading(true);
    try {
      if (!alunoId || !escolaId) throw new Error("Aluno ou instituição não selecionado(a).");
      await atualizarAluno(alunoId, { escolaId });
      setFormFeedback({ type: 'success', message: "Aluno afiliado à instituição com sucesso!" });
      setStep("rematricula");
    } catch (err: any) {
      setFormFeedback({ type: 'error', message: err.message || "Erro ao afiliar aluno à instituição." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRematriculaSubmit = async (e: FormEvent) => {
    e.preventDefault();
    resetFormFeedback();
    setIsLoading(true);
    try {
      if (!alunoId) throw new Error("Aluno não selecionado.");
      await atualizarAluno(alunoId, {
        nome: carteiraData.nome,
        email: carteiraData.email,
        dataNascimento: carteiraData.aniversario ? new Date(carteiraData.aniversario).toISOString() : null,
        // escolaId não precisa ser enviado aqui se for apenas atualização de dados do aluno,
        // a menos que a lógica do backend espere/precise.
      });
      setFormFeedback({ type: 'success', message: "Dados do aluno atualizados com sucesso!" });
      // Opcional: resetar para o início após um tempo ou deixar o usuário clicar em "Buscar outro CPF"
      // setTimeout(() => {
      //   setStep("cpf");
      //   resetFullForm();
      // }, 3000);
    } catch (err: any) {
      setFormFeedback({ type: 'error', message: err.message || "Erro ao atualizar aluno." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoltarCpf = () => {
    setStep("cpf");
    resetFullForm();
  }

  const renderInput = (id: string, label: string, name: string, value: string, type = "text", required = true, readOnly = false, placeholder = "") => (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sky-900 dark:text-sky-100">{label}</Label>
      <Input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={readOnly ? undefined : handleCarteiraChange}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full ${readOnly ? "bg-sky-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed" : "bg-white dark:bg-gray-800 dark:border-gray-700"}`}
      />
    </div>
  );

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <header className="py-6 px-4 md:px-6 text-center row-start-1 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-900 dark:text-sky-100 mb-2">
          Gestão de Alunos da Instituição
        </h1>
        <p className="text-sky-700 dark:text-sky-300 max-w-2xl mx-auto">
          Afilie, cadastre ou atualize dados de alunos.
        </p>
        {escolaId && (
          <div className="text-sm text-sky-800 dark:text-sky-200 mt-2 font-medium">
            Operando com ID da Instituição: <span className="font-bold text-blue-600 dark:text-blue-400">{escolaId}</span>
          </div>
        )}
      </header>

      <main className="flex items-center justify-center p-4 md:p-8 row-start-2">
        <Card className="w-full max-w-lg shadow-xl border-sky-100 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-sky-900 dark:text-sky-100">
                  {step === "cpf" && "Buscar Aluno por CPF"}
                  {step === "criar-aluno" && "Cadastrar Novo Aluno"}
                  {step === "afiliar-escola" && "Afiliar Aluno à Instituição"}
                  {step === "rematricula" && "Atualizar Dados / Rematrícula"}
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  {step === "cpf" && "Insira o CPF para verificar o aluno."}
                  {step === "criar-aluno" && "Preencha os dados do novo aluno."}
                  {step === "afiliar-escola" && `Confirme a afiliação de ${carteiraData.nome || 'aluno'} à instituição ID ${escolaId}.`}
                  {step === "rematricula" && `Atualize os dados de ${carteiraData.nome || 'aluno'} para esta instituição.`}
                </CardDescription>
              </div>
              {step !== "cpf" && (
                <Button variant="outline" size="sm" onClick={handleVoltarCpf} className="dark:text-sky-100 dark:border-gray-600 hover:dark:bg-gray-700">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Buscar outro CPF
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-2">
            {formFeedback && (
              <div className={`p-3 rounded-md text-sm flex items-center gap-2 border ${
                formFeedback.type === 'error' 
                ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300' 
                : 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'
              }`}>
                {formFeedback.type === 'error' ? <AlertTriangle className="h-5 w-5 flex-shrink-0" /> : <CheckCircle2 className="h-5 w-5 flex-shrink-0" />}
                <span>{formFeedback.message}</span>
              </div>
            )}

            {step === "cpf" && (
              <form onSubmit={handleCpfSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="cpfInput" className="block text-sky-900 dark:text-sky-100 font-medium mb-1">CPF do Aluno</Label>
                  <Input
                    id="cpfInput"
                    type="text"
                    value={cpf}
                    onChange={(e) => {setCpf(e.target.value.replace(/\D/g, '')); resetFormFeedback();}}
                    required
                    maxLength={11}
                    className="dark:bg-gray-800 dark:text-sky-100 dark:border-gray-700"
                    placeholder="Digite apenas os números do CPF"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  disabled={isLoading || !escolaId || !cpf.trim() || cpf.length < 11}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  {isLoading ? "Buscando..." : "Buscar"}
                </Button>
              </form>
            )}

            {step === "criar-aluno" && (
              <form className="space-y-4" onSubmit={handleCriarAlunoSubmit}>
                {renderInput("nome", "Nome Completo", "nome", carteiraData.nome, "text", true, false, "Nome completo do aluno")}
                {renderInput("cpfDisplay", "CPF", "cpf", carteiraData.cpf, "text", true, true)}
                {renderInput("aniversario", "Data de Nascimento", "aniversario", carteiraData.aniversario, "date", true)}
                {renderInput("email", "Email", "email", carteiraData.email, "email", true, false, "email@exemplo.com")}
                {renderInput("pais", "País", "pais", carteiraData.pais, "text", true, true)}
                {renderInput("escolaIdInputCad", "ID da Instituição", "escolaId", String(escolaId), "text", true, true)}
                <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  {isLoading ? "Cadastrando..." : "Cadastrar Aluno"}
                </Button>
              </form>
            )}

            {step === "afiliar-escola" && aluno && (
              <form className="space-y-6" onSubmit={handleAfiliarEscolaSubmit}>
                <div className="p-4 bg-sky-50 dark:bg-gray-800 rounded-md border border-sky-100 dark:border-gray-700 space-y-1">
                    <p className="text-sm text-sky-800 dark:text-sky-200">
                        <span className="font-medium">Aluno:</span> {aluno.nome} (CPF: {aluno.cpf})
                    </p>
                    <p className="text-sm text-sky-800 dark:text-sky-200">
                        <span className="font-medium">Instituição Anterior ID:</span> {aluno.escolaId || "N/A"}
                    </p>
                    <p className="text-sm text-sky-800 dark:text-sky-200">
                        <span className="font-medium">Nova Instituição ID:</span> {escolaId}
                    </p>
                </div>
                <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LinkIconLucide className="mr-2 h-4 w-4" />}
                  {isLoading ? "Afiliando..." : "Afiliar Aluno a esta Instituição"}
                </Button>
              </form>
            )}

            {step === "rematricula" && (
              <form className="space-y-4" onSubmit={handleRematriculaSubmit}>
                {renderInput("nomeRematricula", "Nome Completo", "nome", carteiraData.nome, "text", true, false, "Nome completo do aluno")}
                {renderInput("cpfRematricula", "CPF", "cpf", carteiraData.cpf, "text", true, true)}
                {renderInput("aniversarioRematricula", "Data de Nascimento", "aniversario", carteiraData.aniversario, "date", true)}
                {renderInput("emailRematricula", "Email", "email", carteiraData.email, "email", true, false, "email@exemplo.com")}
                {renderInput("escolaIdRematricula", "ID da Instituição", "escolaId", String(escolaId), "text", true, true)}
                 <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isLoading ? "Atualizando..." : "Atualizar Dados e Rematricular"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="pt-6">
             <p className="text-xs text-gray-500 dark:text-gray-400 text-center w-full">
                Verifique os dados cuidadosamente antes de submeter.
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

// Componente principal da página que envolve o conteúdo com Suspense
export default function CadastrarEscolaPage() {
  return (
    <Suspense 
        fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
                <Loader2 className="h-12 w-12 text-sky-600 dark:text-blue-400 animate-spin mb-4" />
                <p className="text-xl text-sky-800 dark:text-sky-200">Carregando interface de gestão...</p>
            </div>
        }
    >
      <CadastrarEscolaContent />
    </Suspense>
  );
}