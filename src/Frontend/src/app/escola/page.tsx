'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EscolherEscola() {
  const [escolaId, setEscolaId] = useState("");
  const [escola, setEscola] = useState<any>(null);
  const router = useRouter();

  const handleBuscarEscola = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/escolas/${escolaId}`);
    if (res.ok) {
      const data = await res.json();
      setEscola(data);
    } else {
      setEscola(null);
      alert("Escola não encontrada");
    }
  };

  const handleEntrar = () => {
    router.push(`/escola/cadastrar?escolaId=${escolaId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white">
      <form onSubmit={handleBuscarEscola} className="space-y-4 bg-white p-8 rounded-xl shadow-lg border border-sky-100">
        <label className="block text-sky-900 font-medium mb-1">Digite o ID da escola</label>
        <input
          type="number"
          value={escolaId}
          onChange={e => setEscolaId(e.target.value)}
          required
          className="w-full px-4 py-2 border border-sky-200 rounded-lg"
          placeholder="ID da escola"
        />
        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-lg"
        >
          Buscar escola
        </button>
      </form>
      {escola && (
        <div className="mt-6 bg-sky-50 p-4 rounded-lg shadow">
          <div className="font-bold text-sky-900">Escola encontrada:</div>
          <div>Nome: {escola.nome}</div>
          <div>ID: {escola.id}</div>
          <button
            onClick={handleEntrar}
            className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Entrar
          </button>
        </div>
      )}
    </div>
  );
}