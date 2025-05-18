"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Aluno = {
  nome: string
  cpf: string
  email: string
  dataNascimento: string
  walletAddress: string
  escolaId: number
}

type Escola = {
  id: number
  nome: string
}

type Premio = {
  id: number
  nome: string
  descricao: string
}

const TODOS_PREMIOS: Premio[] = [
  { id: 1, nome: "OBMEP", descricao: "Olimpíada Brasileira de Matemática" },
  { id: 2, nome: "OBA", descricao: "Olimpíada Brasileira de Astronomia" },
  { id: 3, nome: "Redação Nota 1000", descricao: "Destaque em redação ENEM" },
  { id: 4, nome: "OBQ", descricao: "Olimpíada Brasileira de Química" },
  { id: 5, nome: "OBF", descricao: "Olimpíada Brasileira de Física" },
  { id: 6, nome: "OBI", descricao: "Olimpíada Brasileira de Informática" },
  { id: 7, nome: "OBR", descricao: "Olimpíada Brasileira de Robótica" },
  { id: 8, nome: "OBL", descricao: "Olimpíada Brasileira de Linguística" },
  { id: 9, nome: "OBMEP Nível A", descricao: "OBMEP Nível A" },
  { id: 10, nome: "OBMEP Nível B", descricao: "OBMEP Nível B" },
  { id: 11, nome: "Olimpíada de História", descricao: "Olimpíada Nacional em História do Brasil" },
  { id: 12, nome: "Olimpíada de Biologia", descricao: "Olimpíada Brasileira de Biologia" },
  { id: 13, nome: "Olimpíada de Geografia", descricao: "Olimpíada Brasileira de Geografia" },
  { id: 14, nome: "Olimpíada de Filosofia", descricao: "Olimpíada Brasileira de Filosofia" },
  { id: 15, nome: "Olimpíada de Artes", descricao: "Olimpíada Brasileira de Artes" },
]

export default function ConsultaAlunoHonr() {
  const [cpf, setCpf] = useState("")
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [escola, setEscola] = useState<Escola | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [msg, setMsg] = useState("")
  const [premioSelecionado, setPremioSelecionado] = useState<string | null>(null)

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setAluno(null)
    setEscola(null)
    setMsg("")
    setPremioSelecionado(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/aluno?cpf=${cpf}`)
      if (!res.ok) throw new Error("Erro ao buscar aluno")
      const data = await res.json()
      if (!data) {
        setError("Aluno não encontrado.")
        setLoading(false)
        return
      }
      setAluno(data)
      // Buscar escola
      const escolaRes = await fetch(`/api/escolas/${data.escolaId}`)
      if (escolaRes.ok) {
        const escolaData = await escolaRes.json()
        setEscola(escolaData)
      }
    } catch (err: any) {
      setError(err.message || "Erro ao buscar aluno")
    }
    setLoading(false)
  }

  const handleEnviarNFT = async () => {
    if (!premioSelecionado) return
    setEnviando(true)
    setMsg("")
    // Aqui você pode chamar sua API para enviar o NFT com o prêmio selecionado
    setTimeout(() => {
      setEnviando(false)
      setMsg("NFT de honra ao mérito enviado com sucesso para a carteira do aluno!")
    }, 1500)
  }

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <header className="py-6 px-4 md:px-6 text-center row-start-1 bg-white dark:bg-gray-900">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-900 dark:text-sky-100 mb-2">Consulta de Aluno</h1>
        <p className="text-sky-700 dark:text-sky-300 max-w-2xl mx-auto">Digite o CPF do aluno para consultar informações institucionais, carteira e enviar honrarias.</p>
      </header>

      <main className="flex items-center justify-center p-4 md:p-8 row-start-2">
        <Card className="w-full max-w-md shadow-lg border-sky-100 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-sky-900 dark:text-sky-100">Buscar Aluno</CardTitle>
            <CardDescription className="dark:text-gray-300">Informe o CPF do aluno para consultar seus dados.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBuscar} className="space-y-4">
              <div>
                <Label htmlFor="cpf" className="dark:text-gray-200">CPF do aluno</Label>
                <Input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                  maxLength={11}
                  required
                  placeholder="Digite o CPF"
                  className="mt-1 dark:bg-gray-800 dark:text-sky-100 dark:border-gray-700"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 text-sm rounded">
                {error}
              </div>
            )}

            {aluno && (
              <div className="mt-6 space-y-3">
                <div>
                  <span className="font-semibold text-sky-900 dark:text-sky-100">Nome:</span> {aluno.nome}
                </div>
                <div>
                  <span className="font-semibold text-sky-900 dark:text-sky-100">CPF:</span> {aluno.cpf}
                </div>
                <div>
                  <span className="font-semibold text-sky-900 dark:text-sky-100">Carteira:</span>{" "}
                  <Badge variant="outline" className="text-xs dark:bg-gray-800 dark:text-sky-100 dark:border-gray-700">{aluno.walletAddress}</Badge>
                </div>
                <div>
                  <span className="font-semibold text-sky-900 dark:text-sky-100">Escola:</span>{" "}
                  {escola ? escola.nome : <span className="italic text-gray-500 dark:text-gray-400">Carregando...</span>}
                </div>
                <div className="mt-6">
                  <Label htmlFor="premio" className="dark:text-gray-200">Selecione o prêmio/honraria</Label>
                  <Select
                    value={premioSelecionado ?? ""}
                    onValueChange={setPremioSelecionado}
                  >
                    <SelectTrigger className="w-full mt-1 dark:bg-gray-800 dark:text-sky-100 dark:border-gray-700">
                      <SelectValue placeholder="Selecione um prêmio" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900 dark:text-sky-100">
                      {TODOS_PREMIOS.map((premio) => (
                        <SelectItem key={premio.id} value={premio.nome} className="dark:bg-gray-900 dark:text-sky-100">
                          <span className="font-medium">{premio.nome}</span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400">{premio.descricao}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <Button
                    onClick={handleEnviarNFT}
                    className="bg-sky-700 hover:bg-sky-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                    disabled={enviando || !premioSelecionado}
                    type="button"
                  >
                    {enviando ? "Enviando NFT..." : "Enviar NFT de Honra ao Mérito"}
                  </Button>
                  {msg && (
                    <div className="p-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-sm rounded">
                      {msg}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      
    </div>
  )
}