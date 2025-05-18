"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Search, MapPin, School, Award, Building, Star, ChevronDown, ChevronUp, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"

// Importar o componente de mapa dinamicamente para evitar erros de SSR
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
      Carregando mapa...
    </div>
  ),
})

// Interface para as instituições
interface Instituicao {
  id: number;
  nome: string;
  tipo: string;
  endereco: string;
  cidade: string;
  estado: string;
  lat: number;
  lng: number;
  email?: string;
  telefone?: string;
}

const instituicoesBase: Instituicao[] = [
  {
    id: 1,
    nome: "Universidade Federal",
    tipo: "escola",
    endereco: "Av. Principal, 1000",
    cidade: "São Paulo",
    estado: "SP",
    lat: -23.5505,
    lng: -46.6333,
    email: "contato@universidadefederal.edu.br",
    telefone: "(11) 3333-5000"
  },
  {
    id: 2,
    nome: "Instituto Técnico",
    tipo: "escola",
    endereco: "Rua das Flores, 500",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    lat: -22.9068,
    lng: -43.1729,
    email: "secretaria@institutotecnico.edu.br",
    telefone: "(21) 2542-8800"
  },
  {
    id: 3,
    nome: "Fundação de Pesquisa",
    tipo: "merito",
    endereco: "Av. Tecnológica, 200",
    cidade: "Belo Horizonte",
    estado: "MG",
    lat: -19.9167,
    lng: -43.9345,
    email: "contato@fundacaopesquisa.org.br",
    telefone: "(31) 3399-7700"
  },
  {
    id: 4,
    nome: "Secretaria de Educação",
    tipo: "governo",
    endereco: "Praça da República, 100",
    cidade: "Brasília",
    estado: "DF",
    lat: -15.7801,
    lng: -47.9292,
    email: "atendimento@educacao.gov.br",
    telefone: "(61) 2022-8000"
  },
  {
    id: 5,
    nome: "Empresa de Tecnologia",
    tipo: "oportunidade",
    endereco: "Av. Inovação, 800",
    cidade: "Recife",
    estado: "PE",
    lat: -8.0476,
    lng: -34.877,
    email: "carreiras@emptec.com.br",
    telefone: "(81) 3333-2020"
  },
  {
    id: 6,
    nome: "Empresa de Tecnologia",
    tipo: "oportunidade",
    endereco: "Av. Inovação, 800",
    cidade: "Recife",
    estado: "PE",
    lat: -8.0476,
    lng: -34.877,
    email: "oportunidades@techinova.com.br",
    telefone: "(81) 3366-4040"
  },
];

// Função para gerar novas escolas apenas no Brasil
function gerarNovasEscolas(quantidade: number, idInicial: number): Instituicao[] {
  const novas = [];
  const nomesBaseEscola = [
    "Escola Estadual", "Colégio Municipal", "Instituto de Ensino", "Centro Educacional",
    "Escola Técnica", "Liceu", "Escola Primária", "Ginásio", "Escola de Aplicação",
    "Complexo Escolar"
  ];
  const nomesComplementares = [
    "Prof. João Silva", "Maria Quitéria", "Santos Dumont", "Dom Pedro II", "Tiradentes",
    "Monteiro Lobato", "Cecília Meireles", "Rui Barbosa", "Castro Alves", "Anita Garibaldi",
    "Sol Nascente", "Estrela Guia", "Nova Esperança", "Caminho do Saber", "Futuro Brilhante",
    "Vila Nova", "Jardim das Flores", "Boa Vista", "Centro", "Águas Claras"
  ];
  const tiposLogradouro = ["Rua", "Avenida", "Travessa", "Alameda", "Praça", "Estrada"];
  const nomesLogradouro = [
    "das Palmeiras", "dos Girassóis", "Principal", "Central", "da Liberdade",
    "7 de Setembro", "15 de Novembro", "do Comércio", "das Acácias", "dos Pinheiros",
    "Boa Esperança", "Alegria", "das Nações", "Brasil", "da República"
  ];

  // Todas as cidades são brasileiras
  const cidadesInfo = [
    { nome: "Curitiba", estado: "PR", latBase: -25.4284, lngBase: -49.2733, ddd: "41" },
    { nome: "Porto Alegre", estado: "RS", latBase: -30.0346, lngBase: -51.2177, ddd: "51" },
    { nome: "Salvador", estado: "BA", latBase: -12.9714, lngBase: -38.5014, ddd: "71" },
    { nome: "Manaus", estado: "AM", latBase: -3.1190, lngBase: -60.0217, ddd: "92" },
    { nome: "Fortaleza", estado: "CE", latBase: -3.7327, lngBase: -38.5267, ddd: "85" },
    { nome: "Goiânia", estado: "GO", latBase: -16.6869, lngBase: -49.2643, ddd: "62" },
    { nome: "Belém", estado: "PA", latBase: -1.4558, lngBase: -48.5039, ddd: "91" },
    { nome: "Florianópolis", estado: "SC", latBase: -27.5935, lngBase: -48.55854, ddd: "48" },
    { nome: "Vitória", estado: "ES", latBase: -20.3155, lngBase: -40.3128, ddd: "27" },
    { nome: "Campo Grande", estado: "MS", latBase: -20.4697, lngBase: -54.6201, ddd: "67" }
  ];

  // Domínios comuns para escolas
  const dominios = ["edu.br", "escolas.com.br", "ensino.org.br", "educacional.net.br", "estudantes.org.br"];

  for (let i = 0; i < quantidade; i++) {
    const nomeEscolaBase = nomesBaseEscola[Math.floor(Math.random() * nomesBaseEscola.length)];
    const nomeComplementar = nomesComplementares[Math.floor(Math.random() * nomesComplementares.length)];
    const nomeCompleto = `${nomeEscolaBase} ${nomeComplementar}`;

    const tipoLog = tiposLogradouro[Math.floor(Math.random() * tiposLogradouro.length)];
    const nomeLog = nomesLogradouro[Math.floor(Math.random() * nomesLogradouro.length)];
    const numero = Math.floor(Math.random() * 2000) + 1;
    const enderecoCompleto = `${tipoLog} ${nomeLog}, ${numero}`;

    const cidadeSelecionada = cidadesInfo[Math.floor(Math.random() * cidadesInfo.length)];

    // Limita a variação das coordenadas para garantir que fiquem próximas da cidade base (e dentro do Brasil)
    const lat = parseFloat((cidadeSelecionada.latBase + (Math.random() - 0.5) * 0.02).toFixed(4));
    const lng = parseFloat((cidadeSelecionada.lngBase + (Math.random() - 0.5) * 0.02).toFixed(4));

    // Gera um domínio baseado no nome da escola
    const nomeSemEspacos = nomeEscolaBase.toLowerCase().replace(/\s+/g, "");
    const dominio = dominios[Math.floor(Math.random() * dominios.length)];
    const email = `contato@${nomeSemEspacos}${Math.floor(Math.random() * 100)}.${dominio}`;

    // Gera telefone com DDD da cidade
    const telefone = `(${cidadeSelecionada.ddd}) ${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;

    novas.push({
      id: idInicial + i,
      nome: nomeCompleto,
      tipo: "escola",
      endereco: enderecoCompleto,
      cidade: cidadeSelecionada.nome,
      estado: cidadeSelecionada.estado,
      lat: lat,
      lng: lng,
      email: email,
      telefone: telefone
    });
  }
  return novas;
}

// Encontra o maior ID existente para continuar a sequência
let proximoId = 1;
if (instituicoesBase.length > 0) {
  proximoId = Math.max(...instituicoesBase.map(inst => inst.id)) + 1;
}

const cinquentaNovasEscolas = gerarNovasEscolas(50, proximoId);

// Adiciona as novas escolas ao array original
const instituicoes = [...instituicoesBase, ...cinquentaNovasEscolas];

// Interface para detalhes de escola
interface DetalhesEscola {
  quantidadeAlunos: number;
  alunosHonra: number;
  enderecoBanco: string;
  alunosMaisHonra: { nome: string; honras: number }[];
  email?: string;
  telefone?: string;
}

// Função simulada para buscar detalhes da escola (substitua por chamada real ao backend)
function buscarDetalhesEscola(id: number): DetalhesEscola {
  // Encontre a instituição pelo ID para obter email e telefone
  const instituicao = instituicoes.find(inst => inst.id === id);

  // Simule dados
  // Para simular "talentos", algumas escolas terão alunosMaisHonra vazio
  const temTalentos = id % 3 !== 0; // só para simulação: 2/3 das escolas têm talentos
  return {
    quantidadeAlunos: Math.floor(id * 13 % 1000) + 100, // deterministic
    alunosHonra: temTalentos ? Math.floor(id * 7 % 100) : 0,
    enderecoBanco: "Endereço atualizado do banco de dados",
    alunosMaisHonra: temTalentos
      ? [
        { nome: "Ana Silva", honras: 5 + (id % 5) },
        { nome: "Carlos Souza", honras: 4 + (id % 3) },
        { nome: "Maria Oliveira", honras: 3 + (id % 2) },
      ]
      : [],
    email: instituicao?.email,
    telefone: instituicao?.telefone
  }
}

// NOVO: Ordena as escolas por quantidade de NFTs (alunosHonra) decrescente
function ordenarEscolasPorNFTs(lista: typeof instituicoes) {
  return [...lista].sort((a, b) => {
    const detalhesA = buscarDetalhesEscola(a.id)
    const detalhesB = buscarDetalhesEscola(b.id)
    return (detalhesB.alunosHonra || 0) - (detalhesA.alunosHonra || 0)
  })
}

export default function MapaPage() {
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null)
  const [termoBusca, setTermoBusca] = useState("")
  const [apenasComTalentos, setApenasComTalentos] = useState(false)
  const [instituicoesFiltradas, setInstituicoesFiltradas] = useState(instituicoes)
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<number | null>(null)
  const [detalhesEscola, setDetalhesEscola] = useState<DetalhesEscola | null>(null)
  const [detalhesBoxVisivel, setDetalhesBoxVisivel] = useState(false)
  const [dashboardExpandido, setDashboardExpandido] = useState(true)

  // Atualiza detalhes ao selecionar uma instituição
  useEffect(() => {
    if (instituicaoSelecionada) {
      setDetalhesEscola(buscarDetalhesEscola(instituicaoSelecionada))
    } else {
      setDetalhesEscola(null)
    }
  }, [instituicaoSelecionada])

  // Atualiza lista filtrada e ordena por NFTs
  useEffect(() => {
    let resultado = instituicoes

    if (filtroTipo && filtroTipo !== "todos") {
      resultado = resultado.filter((inst) => inst.tipo === filtroTipo)
    }

    if (termoBusca) {
      const termoLower = termoBusca.toLowerCase()
      resultado = resultado.filter(
        (inst) =>
          inst.nome.toLowerCase().includes(termoLower) ||
          inst.cidade.toLowerCase().includes(termoLower) ||
          inst.estado.toLowerCase().includes(termoLower),
      )
    }

    // Filtro: apenas escolas com talentos (alunos com honras)
    if (apenasComTalentos) {
      resultado = resultado.filter((inst) => {
        const detalhes = buscarDetalhesEscola(inst.id)
        return detalhes.alunosMaisHonra && detalhes.alunosMaisHonra.length > 0
      })
    }

    // Ordena por quantidade de NFTs (alunosHonra)
    resultado = ordenarEscolasPorNFTs(resultado)

    setInstituicoesFiltradas(resultado)
  }, [filtroTipo, termoBusca, apenasComTalentos])

  // Ícones para os diferentes tipos de instituições
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "aluno":
        return <MapPin className="h-4 w-4 text-blue-500" />
      case "escola":
        return <School className="h-4 w-4 text-green-600" />
      case "merito":
        return <Award className="h-4 w-4 text-purple-600" />
      case "governo":
        return <Building className="h-4 w-4 text-red-600" />
      case "oportunidade":
        return <Star className="h-4 w-4 text-amber-500" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  // Nomes para os tipos de instituições
  const getTipoNome = (tipo: string) => {
    const nomes: Record<string, string> = {
      aluno: "Aluno",
      escola: "Escola",
      merito: "Instituição de Mérito",
      governo: "Governo",
      oportunidade: "Instituição de Oportunidade",
    }
    return nomes[tipo] || tipo
  }

  // Handler para abrir detalhes flutuante do mapa
  const handleAbrirDetalhesBox = (id: number) => {
    setInstituicaoSelecionada(id)
    setDetalhesBoxVisivel(true)
  }

  // Handler para fechar detalhes flutuante do mapa
  const handleFecharDetalhesBox = () => {
    setDetalhesBoxVisivel(false)
  }

  // Encontra a instituição selecionada
  const instituicaoAtual = instituicaoSelecionada
    ? instituicoes.find(inst => inst.id === instituicaoSelecionada)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <header className="py-4 px-4 md:px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center text-sky-600 hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-400 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-xl font-bold text-sky-900 dark:text-sky-100">Mapa de Instituições</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel lateral com filtros e lista */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h2 className="font-medium text-sky-900 dark:text-sky-100">Filtros</h2>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select value={filtroTipo || ""} onValueChange={(value) => setFiltroTipo(value || null)}>
                        <SelectTrigger className="dark:bg-gray-800 dark:text-sky-100">
                          <SelectValue placeholder="Tipo de instituição" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-900 dark:text-sky-100">
                          <SelectItem value="todos">Todos os tipos</SelectItem>
                          <SelectItem value="escola">Escolas</SelectItem>
                          <SelectItem value="merito">Instituições de Mérito</SelectItem>
                          <SelectItem value="governo">Governo</SelectItem>
                          <SelectItem value="oportunidade">Instituições de Oportunidade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        type="text"
                        placeholder="Buscar..."
                        className="pl-8 dark:bg-gray-800 dark:text-sky-100"
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Filtro: apenas escolas com talentos */}
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      id="talentos"
                      type="checkbox"
                      checked={apenasComTalentos}
                      onChange={() => setApenasComTalentos((v) => !v)}
                      className="accent-sky-600 dark:accent-blue-500"
                    />
                    <label htmlFor="talentos" className="text-sm text-sky-900 dark:text-sky-100 cursor-pointer">
                      Só escolas com talentos (NFT)
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-medium text-sky-900 dark:text-sky-100">Instituições ({instituicoesFiltradas.length})</h2>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {instituicoesFiltradas.length > 0 ? (
                      instituicoesFiltradas.map((inst) => (
                        <div
                          key={inst.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${instituicaoSelecionada === inst.id
                            ? "bg-sky-100 dark:bg-blue-900/30 border-sky-200 dark:border-blue-700"
                            : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-100 dark:border-gray-700"
                            }`}
                          onClick={() => setInstituicaoSelecionada(inst.id)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">{getTipoIcon(inst.tipo)}</div>
                            <div className="flex-1">
                              <h3 className="font-medium text-sky-900 dark:text-sky-100">{inst.nome}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{inst.endereco}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {inst.cidade}, {inst.estado}
                              </p>
                              {/* Exibindo email e telefone */}
                              {inst.email && (
                                <p className="text-xs flex items-center gap-1 mt-1 text-sky-600 dark:text-blue-300">
                                  <Mail className="h-3 w-3" />
                                  {inst.email}
                                </p>
                              )}
                              {inst.telefone && (
                                <p className="text-xs flex items-center gap-1 text-sky-600 dark:text-blue-300">
                                  <Phone className="h-3 w-3" />
                                  {inst.telefone}
                                </p>
                              )}
                              <div className="mt-1 flex gap-2 items-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 dark:bg-blue-900/30 text-sky-800 dark:text-blue-200">
                                  {getTipoNome(inst.tipo)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2 py-0.5 h-6 dark:bg-gray-800 dark:text-sky-100 dark:border-gray-700"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAbrirDetalhesBox(inst.id)
                                  }}
                                >
                                  Ver detalhes
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>Nenhuma instituição encontrada com os filtros atuais.</p>
                        <Button
                          variant="link"
                          className="mt-2 text-sky-600 dark:text-blue-300"
                          onClick={() => {
                            setFiltroTipo(null)
                            setTermoBusca("")
                            setApenasComTalentos(false)
                          }}
                        >
                          Limpar filtros
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard de detalhes - agora expansível e maior */}
            <Card className="dark:bg-gray-900 dark:border-gray-800">
              <CardContent className={`p-4 transition-all duration-300 ${dashboardExpandido ? "h-auto" : "h-16 overflow-hidden"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-sky-900 dark:text-sky-100">Dashboard da Escola</h2>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-2 dark:text-sky-100"
                    onClick={() => setDashboardExpandido((v) => !v)}
                    aria-label={dashboardExpandido ? "Recolher dashboard" : "Expandir dashboard"}
                  >
                    {dashboardExpandido ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </div>
                {detalhesEscola && instituicaoSelecionada ? (
                  <>
                    <p className="dark:text-gray-200"><b>Quantidade de alunos:</b> {detalhesEscola.quantidadeAlunos}</p>
                    <p className="dark:text-gray-200"><b>Alunos com honras ao mérito:</b> {detalhesEscola.alunosHonra}</p>
                    <p className="dark:text-gray-200"><b>Endereço (banco de dados):</b> {detalhesEscola.enderecoBanco}</p>

                    {/* Informações de contato */}
                    {detalhesEscola.email && (
                      <p className="flex items-center gap-1 mt-2 text-sky-700 dark:text-blue-300">
                        <Mail className="h-4 w-4" />
                        <b>Email:</b> {detalhesEscola.email}
                      </p>
                    )}
                    {detalhesEscola.telefone && (
                      <p className="flex items-center gap-1 text-sky-700 dark:text-blue-300">
                        <Phone className="h-4 w-4" />
                        <b>Telefone:</b> {detalhesEscola.telefone}
                      </p>
                    )}

                    <div className="mt-2">
                      <b className="dark:text-gray-200">Alunos com mais honras ao mérito:</b>
                      {detalhesEscola.alunosMaisHonra.length > 0 ? (
                        <ul className="list-disc ml-5 dark:text-gray-200">
                          {detalhesEscola.alunosMaisHonra.map((aluno: any, idx: number) => (
                            <li key={idx}>{aluno.nome} ({aluno.honras} honras)</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Nenhum talento registrado nesta escola.</span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Selecione uma escola para ver o dashboard.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="h-full dark:bg-gray-900 dark:border-gray-800">
              <CardContent className="p-0 h-[600px]">
                <MapComponent
                  instituicoes={instituicoesFiltradas}
                  instituicaoSelecionada={instituicaoSelecionada}
                  setInstituicaoSelecionada={setInstituicaoSelecionada}
                  detalhesEscola={detalhesEscola}
                  detalhesBoxVisivel={detalhesBoxVisivel}
                  onAbrirDetalhesBox={handleAbrirDetalhesBox}
                  onFecharDetalhesBox={handleFecharDetalhesBox}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="py-4 px-4 text-center text-sm text-sky-600 dark:text-sky-200 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <p>© {new Date().getFullYear()} Passaporte Acadêmico On-Chain • Todos os direitos reservados</p>
      </footer>
    </div>
  )
}