'use client'
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Escola() {
  const searchParams = useSearchParams();
  const escolaIdParam = searchParams.get("escolaId");
  const [cpf, setCpf] = useState("");
  const [step, setStep] = useState<"cpf" | "criar-aluno" | "afiliar-escola" | "rematricula">("cpf");
  const [carteiraData, setCarteiraData] = useState({
    nome: "",
    cpf: "",
    aniversario: "",
    pais: "BRA",
    email: "",
  });
  const [alunoId, setAlunoId] = useState<number | null>(null);
  const [aluno, setAluno] = useState<any>(null);
  const [escolaId, setEscolaId] = useState<number | null>(escolaIdParam ? Number(escolaIdParam) : null);

  // ...fetch escolas se quiser mostrar nome, mas não obrigatório...

  const buscarAlunoPorCpf = async (cpf: string) => {
    const res = await fetch(`/api/aluno?cpf=${cpf}`);
    if (res.ok) {
      const aluno = await res.json();
      return aluno;
    }
    return null;
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

  const handleCpfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!escolaId) {
      alert("Selecione o ID da escola primeiro.");
      return;
    }
    try {
      const aluno = await buscarAlunoPorCpf(cpf);
      setAluno(aluno);
      if (!aluno) {
        setCarteiraData((prev) => ({ ...prev, cpf }));
        setStep("criar-aluno");
      } else if (aluno.escolaId !== escolaId) {
        setAlunoId(aluno.id);
        setCarteiraData({
          nome: aluno.nome || "",
          cpf: aluno.cpf,
          aniversario: aluno.dataNascimento ? aluno.dataNascimento.slice(0, 10) : "",
          pais: "BRA",
          email: aluno.email || "",
        });
        setStep("afiliar-escola");
      } else {
        setAlunoId(aluno.id);
        setCarteiraData({
          nome: aluno.nome || "",
          cpf: aluno.cpf,
          aniversario: aluno.dataNascimento ? aluno.dataNascimento.slice(0, 10) : "",
          pais: "BRA",
          email: aluno.email || "",
        });
        setStep("rematricula");
      }
    } catch (err: any) {
      alert(err.message || "Erro ao buscar aluno");
    }
  };

  const handleCarteiraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarteiraData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCriarAlunoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const alunoCriado = await criarAluno({
        nome: carteiraData.nome,
        cpf: carteiraData.cpf,
        email: carteiraData.email,
        dataNascimento: carteiraData.aniversario,
        escolaId,
      });
      setAlunoId(alunoCriado.id);
      setStep("rematricula");
    } catch (err: any) {
      alert(err.message || "Erro ao criar aluno");
    }
  };

  const handleAfiliarEscolaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!alunoId || !escolaId) throw new Error("Aluno ou escola não selecionado");
      await atualizarAluno(alunoId, { escolaId });
      alert("Aluno afiliado à escola com sucesso!");
      setStep("rematricula");
    } catch (err: any) {
      alert(err.message || "Erro ao afiliar aluno à escola");
    }
  };

  const handleRematriculaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!alunoId) throw new Error("Aluno não selecionado");
      await atualizarAluno(alunoId, {
        nome: carteiraData.nome,
        email: carteiraData.email,
        dataNascimento: carteiraData.aniversario,
      });
      alert("Dados do aluno atualizados com sucesso!");
      setStep("cpf");
      setCpf("");
      setCarteiraData({ nome: "", cpf: "", aniversario: "", pais: "BRA", email: "" });
      setAlunoId(null);
      setAluno(null);
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar aluno");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <header className="py-6 px-4 md:px-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-900 mb-2">Escola</h1>
        <p className="text-sky-700 max-w-2xl mx-auto">
          Afilie, cadastre ou rematricule alunos digitando o CPF.
        </p>
        {escolaId && <div className="text-sky-800 mt-2">ID da escola em uso: <b>{escolaId}</b></div>}
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-sky-100 p-8 animate-fadeIn">
          {step === "cpf" && (
            <form onSubmit={handleCpfSubmit} className="space-y-6">
              <div>
                <label className="block text-sky-900 font-medium mb-2">CPF do aluno</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  maxLength={11}
                  className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Digite o CPF"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Buscar
              </button>
            </form>
          )}
          {step === "criar-aluno" && (
            <form className="space-y-4 mt-4" onSubmit={handleCriarAlunoSubmit}>
              <h3 className="text-lg font-bold text-sky-900 mb-2">Cadastrar novo aluno</h3>
              <div>
                <label className="block text-sky-900 font-medium mb-1">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={carteiraData.nome}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sky-900 font-medium mb-1">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={carteiraData.cpf}
                  readOnly
                  className="w-full px-4 py-2 border border-sky-100 bg-sky-50 rounded-lg text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sky-900 font-medium mb-1">Data de aniversário</label>
                <input
                  type="date"
                  name="aniversario"
                  value={carteiraData.aniversario}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <div>
                <label className="block text-sky-900 font-medium mb-1">País</label>
                <input
                  type="text"
                  name="pais"
                  value={carteiraData.pais}
                  readOnly
                  className="w-full px-4 py-2 border border-sky-100 bg-sky-50 rounded-lg text-gray-500"
                  placeholder="BRA"
                />
              </div>

              <div>
                <label className="block text-sky-900 font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={carteiraData.email}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sky-900 font-medium mb-1">ID da Escola</label>
                <input
                  type="number"
                  value={escolaId ?? ""}
                  onChange={e => setEscolaId(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Digite o ID da escola"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Cadastrar aluno
              </button>
            </form>
          )}
          {step === "afiliar-escola" && (
            <form className="space-y-4 mt-4" onSubmit={handleAfiliarEscolaSubmit}>
              <h3 className="text-lg font-bold text-sky-900 mb-2">Afiliar aluno à escola</h3>
              <div className="mb-2">Aluno: <b>{carteiraData.nome}</b> (CPF: {carteiraData.cpf})</div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Afiliar aluno
              </button>
            </form>
          )}
          {step === "rematricula" && (
            <form className="space-y-4 mt-4" onSubmit={handleRematriculaSubmit}>
              <h3 className="text-lg font-bold text-sky-900 mb-2">Rematrícula / Atualizar dados</h3>
              <div>
                <label className="block text-sky-900 font-medium mb-1">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={carteiraData.nome}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 rounded-lg"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-sky-900 font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={carteiraData.email}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 rounded-lg"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sky-900 font-medium mb-1">Data de aniversário</label>
                <input
                  type="date"
                  name="aniversario"
                  value={carteiraData.aniversario}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg"
              >
                Atualizar dados
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}