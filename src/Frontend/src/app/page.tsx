import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-gradient-to-b from-sky-50 to-white">
      <header className="py-8 px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-900 mb-2">Passaporte Acadêmico On-Chain</h1>
        <p className="text-sky-700 max-w-2xl mx-auto">
          Escolha sua plataforma para acessar o sistema.
        </p>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center gap-10 px-4">
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
          <Link
            href="/escola"
            className="flex-1 bg-white border border-sky-100 rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition group"
          >
            <span className="text-xl font-semibold text-sky-800 group-hover:text-sky-900">Plataforma Escola</span>
            <span className="text-sky-600 mt-2 text-center text-sm">Acesse como gestor escolar para afiliar alunos e gerenciar carteiras.</span>
          </Link>
          <Link
            href="/governo"
            className="flex-1 bg-white border border-sky-100 rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition group"
          >
            <span className="text-xl font-semibold text-sky-800 group-hover:text-sky-900">Plataforma Governo</span>
            <span className="text-sky-600 mt-2 text-center text-sm">Acesse como órgão público para consultar e validar dados acadêmicos.</span>
          </Link>
          <Link
            href="/instituicao/honr"
            className="flex-1 bg-white border border-sky-100 rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition group"
          >
            <span className="text-xl font-semibold text-sky-800 group-hover:text-sky-900">Instituição de Mérito</span>
            <span className="text-sky-600 mt-2 text-center text-sm">Envie honrarias e prêmios acadêmicos para alunos.</span>
          </Link>
          <Link
            href="/instituicao/map"
            className="flex-1 bg-white border border-sky-100 rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-xl transition group"
          >
            <span className="text-xl font-semibold text-sky-800 group-hover:text-sky-900">Instituição - Mapa</span>
            <span className="text-sky-600 mt-2 text-center text-sm">Visualize o mapa de conquistas e premiações dos alunos.</span>
          </Link>
        </div>
      </main>
      <footer className="py-4 px-4 text-center text-sm text-sky-600">
        <p>© {new Date().getFullYear()} Passaporte Acadêmico On-Chain • Todos os direitos reservados</p>
      </footer>
    </div>
  );
}