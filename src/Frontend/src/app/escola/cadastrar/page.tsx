'use client' // Já está correto
import { useState, useEffect, Suspense } from "react"; // Adicione Suspense
import { useSearchParams } from "next/navigation";

// Componente interno que usa useSearchParams
function CadastrarEscolaContent() {
  const searchParams = useSearchParams(); // Este hook precisa do Suspense
  const escolaIdParam = searchParams.get("escolaId");

  // O resto do seu estado e lógica que depende de escolaIdParam
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
  const [aluno, setAluno] = useState<any>(null); // Considere tipar melhor 'aluno' no futuro
  const [escolaId, setEscolaId] = useState<number | null>(
    escolaIdParam ? Number(escolaIdParam) : null
  );

  useEffect(() => {
    // Se escolaIdParam mudar após a montagem inicial (ex: navegação no cliente)
    // Atualize o estado escolaId
    if (escolaIdParam) {
      setEscolaId(Number(escolaIdParam));
    } else {
      setEscolaId(null);
    }
  }, [escolaIdParam]);


  // ... (suas funções buscarAlunoPorCpf, criarAluno, atualizarAluno) ...
  const buscarAlunoPorCpf = async (cpf: string) => {
    const res = await fetch(`/api/aluno?cpf=${cpf}`);
    if (res.ok) {
      const alunoData = await res.json();
      return alunoData;
    }
    return null;
  };

  const criarAluno = async (data: any) => { // Considere tipar 'data'
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

  const atualizarAluno = async (id: number, data: any) => { // Considere tipar 'data'
    const res = await fetch(`/api/aluno`, { // Se for um PATCH para um aluno específico, deveria ser /api/aluno/${id} ? Ou o ID está no body?
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }), // O ID está no body, ok.
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Erro ao atualizar aluno");
    }
    return await res.json();
  };


  // ... (suas funções handleCpfSubmit, handleCarteiraChange, etc.) ...
  const handleCpfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!escolaId) {
      alert("Selecione o ID da escola primeiro."); // Ou use um sistema de notificação melhor
      return;
    }
    try {
      const alunoEncontrado = await buscarAlunoPorCpf(cpf);
      setAluno(alunoEncontrado);
      if (!alunoEncontrado) {
        setCarteiraData((prev) => ({ ...prev, cpf }));
        setStep("criar-aluno");
      } else if (alunoEncontrado.escolaId !== escolaId) {
        setAlunoId(alunoEncontrado.id);
        setCarteiraData({
          nome: alunoEncontrado.nome || "",
          cpf: alunoEncontrado.cpf,
          aniversario: alunoEncontrado.dataNascimento ? alunoEncontrado.dataNascimento.slice(0, 10) : "",
          pais: "BRA", // alunoEncontrado.pais || "BRA" ?
          email: alunoEncontrado.email || "",
        });
        setStep("afiliar-escola");
      } else {
        setAlunoId(alunoEncontrado.id);
        setCarteiraData({
          nome: alunoEncontrado.nome || "",
          cpf: alunoEncontrado.cpf,
          aniversario: alunoEncontrado.dataNascimento ? alunoEncontrado.dataNascimento.slice(0, 10) : "",
          pais: "BRA",
          email: alunoEncontrado.email || "",
        });
        setStep("rematricula");
      }
    } catch (err: any) { // Tipar 'err' como Error ou unknown
      alert(err.message || "Erro ao buscar aluno");
    }
  };

  const handleCarteiraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarteiraData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCriarAlunoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!escolaId) { // Adicionar verificação de escolaId
        alert("ID da Escola é obrigatório para criar aluno.");
        return;
    }
    try {
      const alunoCriado = await criarAluno({
        nome: carteiraData.nome,
        cpf: carteiraData.cpf,
        email: carteiraData.email,
        dataNascimento: carteiraData.aniversario, // Certifique-se que o formato da data está correto para o backend
        escolaId,
      });
      setAlunoId(alunoCriado.id);
      alert("Aluno criado com sucesso!"); // Feedback para o usuário
      setStep("rematricula"); // Ou talvez redirecionar ou limpar o formulário
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
      // Resetar estado
      setStep("cpf");
      setCpf("");
      setCarteiraData({ nome: "", cpf: "", aniversario: "", pais: "BRA", email: "" });
      setAlunoId(null);
      setAluno(null);
      // Opcional: redirecionar ou atualizar a visualização
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar aluno");
    }
  };

  // Seu JSX aqui
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <header className="py-6 px-4 md:px-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-900 dark:text-sky-100 mb-2">
          {/* Pode ser "Cadastrar Aluno na Escola" ou similar */}
          Escola - Gestão de Alunos
        </h1>
        <p className="text-sky-700 dark:text-sky-300 max-w-2xl mx-auto">
          Afilie, cadastre ou rematricule alunos digitando o CPF.
        </p>
        {escolaId ? (
          <div className="text-sky-800 dark:text-sky-200 mt-2">
            ID da escola em uso: <b>{escolaId}</b>
          </div>
        ) : (
          <div className="text-red-600 dark:text-red-400 mt-2">
            Parâmetro 'escolaId' não encontrado na URL. Verifique o link.
          </div>
        )}
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-sky-100 dark:border-gray-800 p-8 animate-fadeIn">
          {/* Conteúdo do formulário baseado no 'step' */}
          {step === "cpf" && (
            <form onSubmit={handleCpfSubmit} className="space-y-6">
              <div>
                <label htmlFor="cpfInput" className="block text-sky-900 dark:text-sky-100 font-medium mb-2">CPF do aluno</label>
                <input
                  id="cpfInput"
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))} // Remove não dígitos
                  required
                  maxLength={11}
                  className="w-full px-4 py-2 border border-sky-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sky-900 dark:text-sky-100 placeholder:text-sky-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-blue-500"
                  placeholder="Digite o CPF (apenas números)"
                />
              </div>
              <button
                type="submit"
                disabled={!escolaId} // Desabilitar se não houver escolaId
                className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Buscar
              </button>
            </form>
          )}
          {step === "criar-aluno" && (
            <form className="space-y-4 mt-4" onSubmit={handleCriarAlunoSubmit}>
              <h3 className="text-lg font-bold text-sky-900 dark:text-sky-100 mb-2">Cadastrar novo aluno</h3>
              <div>
                <label htmlFor="nome" className="block text-sky-900 dark:text-sky-100 font-medium mb-1">Nome</label>
                <input
                  id="nome"
                  type="text"
                  name="nome"
                  value={carteiraData.nome}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sky-900 dark:text-sky-100 placeholder:text-sky-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-blue-500"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label htmlFor="cpfDisplay" className="block text-sky-900 dark:text-sky-100 font-medium mb-1">CPF</label>
                <input
                  id="cpfDisplay"
                  type="text"
                  name="cpf"
                  value={carteiraData.cpf}
                  readOnly
                  className="w-full px-4 py-2 border border-sky-100 dark:border-gray-700 bg-sky-50 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="aniversario" className="block text-sky-900 dark:text-sky-100 font-medium mb-1">Data de aniversário</label>
                <input
                  id="aniversario"
                  type="date"
                  name="aniversario"
                  value={carteiraData.aniversario}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="pais" className="block text-sky-900 dark:text-sky-100 font-medium mb-1">País</label>
                <input
                  id="pais"
                  type="text"
                  name="pais"
                  value={carteiraData.pais}
                  readOnly // Ou permitir mudar se necessário
                  className="w-full px-4 py-2 border border-sky-100 dark:border-gray-700 bg-sky-50 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400"
                  placeholder="BRA"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sky-900 dark:text-sky-100 font-medium mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={carteiraData.email}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sky-900 dark:text-sky-100 placeholder:text-sky-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-blue-500"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label htmlFor="escolaIdInputCad" className="block text-sky-900 dark:text-sky-100 font-medium mb-1">ID da Escola</label>
                <input
                  id="escolaIdInputCad"
                  type="number"
                  value={escolaId ?? ""}
                  readOnly // O escolaId vem da URL, então deve ser readOnly aqui
                  className="w-full px-4 py-2 border border-sky-100 dark:border-gray-700 bg-sky-50 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Cadastrar aluno
              </button>
            </form>
          )}
          {step === "afiliar-escola" && (
            <form className="space-y-4 mt-4" onSubmit={handleAfiliarEscolaSubmit}>
              <h3 className="text-lg font-bold text-sky-900 dark:text-sky-100 mb-2">Afiliar aluno à escola</h3>
              <div className="mb-2 text-sky-900 dark:text-sky-100">Aluno: <b>{carteiraData.nome}</b> (CPF: {carteiraData.cpf})</div>
              <div className="mb-2 text-sky-900 dark:text-sky-100">Nova Escola ID: <b>{escolaId}</b></div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Afiliar Aluno a esta Escola
              </button>
            </form>
          )}
          {step === "rematricula" && (
            <form className="space-y-4 mt-4" onSubmit={handleRematriculaSubmit}>
              <h3 className="text-lg font-bold text-sky-900 dark:text-sky-100 mb-2">Rematrícula / Atualizar dados do Aluno</h3>
              {/* Campos para nome, email, data de aniversário */}
              <div>
                <label htmlFor="nomeRematricula" className="block text-sky-900 dark:text-sky-100 font-medium mb-1">Nome</label>
                <input
                  id="nomeRematricula"
                  type="text"
                  name="nome"
                  value={carteiraData.nome}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-blue-500"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label htmlFor="emailRematricula" className="block text-sky-900 dark:text-sky-100 font-medium mb-1">Email</label>
                <input
                  id="emailRematricula"
                  type="email"
                  name="email"
                  value={carteiraData.email}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-blue-500"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label htmlFor="aniversarioRematricula" className="block text-sky-900 dark:text-sky-100 font-medium mb-1">Data de aniversário</label>
                <input
                  id="aniversarioRematricula"
                  type="date"
                  name="aniversario"
                  value={carteiraData.aniversario}
                  onChange={handleCarteiraChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sky-900 dark:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-blue-500"
                />
              </div>
              <div className="mb-2 text-sky-900 dark:text-sky-100">Escola ID: <b>{escolaId}</b></div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Atualizar Dados e Rematricular
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

// Componente principal da página que envolve o conteúdo com Suspense
export default function CadastrarEscolaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-xl">Carregando dados da escola...</p></div>}>
      <CadastrarEscolaContent />
    </Suspense>
  );
}