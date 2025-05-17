'use client'
import { useState } from "react";

export default function Escola() {

  const [cpf, setCpf] = useState("");
  const [step, setStep] = useState<"cpf" | "afiliado" | "carteira" | "criar-carteira">("cpf");
  const [carteiraData, setCarteiraData] = useState({
    nome: "",
    cpf: "",
    aniversario: "",
    pais: "",
    email: "",
  });
  // Estado para o endereço da carteira
  const [enderecoCarteira, setEnderecoCarteira] = useState("");

  // Simulação de checagem (substitua por chamada real à API)
  const checkAfiliado = (cpf: string) => {
    // Exemplo: CPF '11111111111' já afiliado, '22222222222' tem carteira, outros não têm
    if (cpf === "11111111111") return "afiliado";
    if (cpf === "22222222222") return "carteira";
    return "criar-carteira";
  };

  const handleCpfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkAfiliado(cpf);
    setStep(result as any);
    if (result === "criar-carteira") {
      setCarteiraData((prev) => ({ ...prev, cpf }));
    }
  };

  const handleCarteiraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarteiraData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para lidar com o submit do formulário de afiliação
  const handleAfiliacaoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para afiliar a carteira usando o endereço informado
    // Por exemplo, chamada à API ou atualização de estado
    alert(`Carteira afiliada: ${enderecoCarteira}`);
    // Após afiliar, você pode resetar o formulário ou mudar o step
    setStep("cpf");
    setEnderecoCarteira("");
    setCpf("");
  };

  // Função para lidar com o submit do formulário de criação de carteira
  const handleCriarCarteiraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Monta o body com os dados do formulário
      // Converte a data para o formato ISO completo
      const birthDateISO = carteiraData.aniversario || "";
      const body = JSON.stringify({
        type: "individual",
        name: carteiraData.nome,
        taxId: carteiraData.cpf,
        birthDate: birthDateISO,
        country: "BRA",
        email: carteiraData.email,
      });
      const response = await fetch("/api/lumx/proxy", { method: "POST", headers: { "Content-Type": "application/json" }, body })
      if (!response.ok) throw new Error('Erro ao criar carteira');
      if (response.status !== 204) {
        await response.json(); // só tenta ler JSON se não for 204
      }
      alert('Carteira criada com sucesso!');
      setStep("cpf");
      setCarteiraData({ nome: "", cpf: "", aniversario: "", pais: "", email: "" });
      setCpf("");
    } catch (err: any) {
      alert(err.message || 'Erro desconhecido ao criar carteira');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <header className="py-6 px-4 md:px-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-900 mb-2">Escola</h1>
        <p className="text-sky-700 max-w-2xl mx-auto">
          Afilie alunos digitando o CPF e criando carteiras automaticamente.
        </p>
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
          {step === "afiliado" && (
            <div className="mt-6 text-center text-red-700 font-semibold">
              Aluno já foi afiliado.
            </div>
          )}
          {step === "carteira" && (
            <form onSubmit={handleAfiliacaoSubmit} className="space-y-6">
              <h3 className="text-lg font-bold text-sky-900 mb-2">Afiliar Carteira do Aluno</h3>
              <div>
                <label className="block text-sky-900 font-medium mb-2">Endereço da Carteira</label>
                <input
                  type="text"
                  value={enderecoCarteira}
                  onChange={(e) => setEnderecoCarteira(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Digite o endereço da carteira"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Afiliar Carteira
              </button>
            </form>
          )}
          {step === "criar-carteira" && (
            <form className="space-y-4 mt-4" onSubmit={handleCriarCarteiraSubmit}>
              <h3 className="text-lg font-bold text-sky-900 mb-2">Criar carteira do aluno</h3>
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
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Criar carteira e afiliar
              </button>
            </form>
          )}
        </div>
      </main>
      <footer className="py-4 px-4 text-center text-sm text-sky-600">
        <p>© {new Date().getFullYear()} Passaporte Acadêmico On-Chain • Todos os direitos reservados</p>
      </footer>
    </div>
  );
}