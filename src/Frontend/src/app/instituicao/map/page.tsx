"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Search, MapPin, School, Award, Building, Star } from "lucide-react"
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

const instituicoesBase = [
  {
    id: 1,
    nome: "Universidade Federal",
    tipo: "escola",
    endereco: "Av. Principal, 1000",
    cidade: "São Paulo",
    estado: "SP",
    lat: -23.5505,
    lng: -46.6333,
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
  },
];

// Função para gerar novas escolas apenas no Brasil
function gerarNovasEscolas(quantidade: number, idInicial: number) {
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
    { nome: "Curitiba", estado: "PR", latBase: -25.4284, lngBase: -49.2733 },
    { nome: "Porto Alegre", estado: "RS", latBase: -30.0346, lngBase: -51.2177 },
    { nome: "Salvador", estado: "BA", latBase: -12.9714, lngBase: -38.5014 },
    { nome: "Manaus", estado: "AM", latBase: -3.1190, lngBase: -60.0217 },
    { nome: "Fortaleza", estado: "CE", latBase: -3.7327, lngBase: -38.5267 },
    { nome: "Goiânia", estado: "GO", latBase: -16.6869, lngBase: -49.2643 },
    { nome: "Belém", estado: "PA", latBase: -1.4558, lngBase: -48.5039 },
    { nome: "Florianópolis", estado: "SC", latBase: -27.5935, lngBase: -48.55854 },
    { nome: "Vitória", estado: "ES", latBase: -20.3155, lngBase: -40.3128 },
    { nome: "Campo Grande", estado: "MS", latBase: -20.4697, lngBase: -54.6201 }
  ];

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

    novas.push({
      id: idInicial + i,
      nome: nomeCompleto,
      tipo: "escola",
      endereco: enderecoCompleto,
      cidade: cidadeSelecionada.nome,
      estado: cidadeSelecionada.estado,
      lat: lat,
      lng: lng,
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

// Função simulada para buscar detalhes da escola (substitua por chamada real ao backend)
function buscarDetalhesEscola(id: number) {
  // Simule dados
  // Para simular "talentos", algumas escolas terão alunosMaisHonra vazio
  const temTalentos = id % 3 !== 0; // só para simulação: 2/3 das escolas têm talentos
  return {
    quantidadeAlunos: Math.floor(id * 13 % 1000) + 100, // deterministic
    alunosHonra: temTalentos ? Math.floor(id * 7 % 100) : 0,
    enderecoBanco: "Endereço atualizado do banco de dados",
    alunosMaisHonra: temTalentos
      ? [
          { nome: "Ana Silva", honras: 5 },
          { nome: "Carlos Souza", honras: 4 },
          { nome: "Maria Oliveira", honras: 3 },
        ]
      : [],
  }
}

export default function MapaPage() {
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null)
  const [termoBusca, setTermoBusca] = useState("")
  const [apenasComTalentos, setApenasComTalentos] = useState(false)
  const [instituicoesFiltradas, setInstituicoesFiltradas] = useState(instituicoes)
  const [instituicaoSelecionada, setInstituicaoSelecionada] = useState<number | null>(null)
  const [detalhesEscola, setDetalhesEscola] = useState<any | null>(null)
  const [detalhesBoxVisivel, setDetalhesBoxVisivel] = useState(false)

  // Atualiza detalhes ao selecionar uma instituição
  useEffect(() => {
    if (instituicaoSelecionada) {
      setDetalhesEscola(buscarDetalhesEscola(instituicaoSelecionada))
    } else {
      setDetalhesEscola(null)
    }
  }, [instituicaoSelecionada])

  // Atualiza lista filtrada
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <header className="py-4 px-4 md:px-6 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center text-sky-600 hover:text-sky-700 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-xl font-bold text-sky-900">Mapa de Instituições</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel lateral com filtros e lista */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h2 className="font-medium text-sky-900">Filtros</h2>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select value={filtroTipo || ""} onValueChange={(value) => setFiltroTipo(value || null)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de instituição" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os tipos</SelectItem>
                          <SelectItem value="escola">Escolas</SelectItem>
                          <SelectItem value="merito">Instituições de Mérito</SelectItem>
                          <SelectItem value="governo">Governo</SelectItem>
                          <SelectItem value="oportunidade">Instituições de Oportunidade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Buscar..."
                        className="pl-8"
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
                      className="accent-sky-600"
                    />
                    <label htmlFor="talentos" className="text-sm text-sky-900 cursor-pointer">
                      Só escolas com talentos (NFT)
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-medium text-sky-900">Instituições ({instituicoesFiltradas.length})</h2>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {instituicoesFiltradas.length > 0 ? (
                      instituicoesFiltradas.map((inst) => (
                        <div
                          key={inst.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${instituicaoSelecionada === inst.id
                              ? "bg-sky-100 border-sky-200"
                              : "bg-white hover:bg-gray-50 border-gray-100"
                            }`}
                          onClick={() => setInstituicaoSelecionada(inst.id)}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">{getTipoIcon(inst.tipo)}</div>
                            <div className="flex-1">
                              <h3 className="font-medium text-sky-900">{inst.nome}</h3>
                              <p className="text-sm text-gray-600">{inst.endereco}</p>
                              <p className="text-xs text-gray-500">
                                {inst.cidade}, {inst.estado}
                              </p>
                              <div className="mt-1 flex gap-2 items-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800">
                                  {getTipoNome(inst.tipo)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs px-2 py-0.5 h-6"
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
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhuma instituição encontrada com os filtros atuais.</p>
                        <Button
                          variant="link"
                          className="mt-2 text-sky-600"
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

            {/* Dashboard de detalhes */}
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold text-sky-900 mb-2">Dashboard da Escola</h2>
                {detalhesEscola && instituicaoSelecionada ? (
                  <>
                    <p><b>Quantidade de alunos:</b> {detalhesEscola.quantidadeAlunos}</p>
                    <p><b>Alunos com honras ao mérito:</b> {detalhesEscola.alunosHonra}</p>
                    <p><b>Endereço (banco de dados):</b> {detalhesEscola.enderecoBanco}</p>
                    <div className="mt-2">
                      <b>Alunos com mais honras ao mérito:</b>
                      {detalhesEscola.alunosMaisHonra.length > 0 ? (
                        <ul className="list-disc ml-5">
                          {detalhesEscola.alunosMaisHonra.map((aluno: any, idx: number) => (
                            <li key={idx}>{aluno.nome} ({aluno.honras} honras)</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">Nenhum talento registrado nesta escola.</span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">Selecione uma escola para ver o dashboard.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="h-full">
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

      <footer className="py-4 px-4 text-center text-sm text-sky-600 border-t">
        <p>© {new Date().getFullYear()} Passaporte Acadêmico On-Chain • Todos os direitos reservados</p>
      </footer>
    </div>
  )
}