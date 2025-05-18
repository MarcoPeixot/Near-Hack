"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Award, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginInstituicaoMerito() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setTimeout(() => {
      setIsLoading(false)
      router.push("/instituicao/honr")
    }, 1500)
  }

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <header className="py-6 px-4 md:px-6 text-center row-start-1 bg-white dark:bg-gray-900">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-900 dark:text-sky-100 mb-2">Passaporte Acadêmico On-Chain</h1>
        <p className="text-sky-700 dark:text-sky-300 max-w-2xl mx-auto">Portal da Instituição de Mérito</p>
      </header>

      <main className="flex items-center justify-center p-4 md:p-8 row-start-2">
        <Card className="w-full max-w-md shadow-lg border-sky-100 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto bg-sky-100 dark:bg-blue-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-sky-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl text-sky-900 dark:text-sky-100">Acesso Institucional</CardTitle>
            <CardDescription className="dark:text-gray-300">Entre com suas credenciais para acessar o portal</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 text-sm rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-gray-200">Email institucional</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@instituicao.edu.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="dark:bg-gray-800 dark:text-sky-100 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="dark:text-gray-200">Senha</Label>
                  <Link href="#" className="text-xs text-sky-600 hover:text-sky-800 dark:text-blue-300 dark:hover:text-blue-400">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="dark:bg-gray-800 dark:text-sky-100 dark:border-gray-700"
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </span>
                )}
              </Button>
              <div className="text-center text-sm text-gray-500 dark:text-gray-300">
                <Link href="/" className="text-sky-600 hover:text-sky-800 dark:text-blue-300 dark:hover:text-blue-400">
                  Voltar para a página inicial
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="py-4 px-4 text-center text-sm text-sky-600 dark:text-sky-200 dark:bg-gray-900 row-start-3">
        <p>© {new Date().getFullYear()} Passaporte Acadêmico On-Chain • Todos os direitos reservados</p>
      </footer>
    </div>
  )
}