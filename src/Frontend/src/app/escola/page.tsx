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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <form onSubmit={handleBuscarEscola} className="space-y-4 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-sky-100 dark:border-gray-800">
        <label className="block text-sky-900 dark:text-sky-100 font-medium mb-1">Digite o ID da escola</label>
        <input
          type="number"
          value={escolaId}
          onChange={e => setEscolaId(e.target.value)}
          required
          className="w-full px-4 py-2 border border-sky-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sky-900 dark:text-sky-100 placeholder:text-sky-400 dark:placeholder:text-gray-400"
          placeholder="ID da escola"
        />
        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Buscar escola
        </button>
      </form>
      {escola && (
        <div className="mt-6 bg-sky-50 dark:bg-gray-800 p-4 rounded-lg shadow border border-sky-100 dark:border-gray-700">
          <div className="font-bold text-sky-900 dark:text-sky-100">Escola encontrada:</div>
          <div className="text-sky-900 dark:text-sky-100">Nome: {escola.nome}</div>
          <div className="text-sky-900 dark:text-sky-100">ID: {escola.id}</div>
          <button
            onClick={handleEntrar}
            className="mt-4 bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Entrar
          </button>
        </div>
      )}
    </div>
  );
}