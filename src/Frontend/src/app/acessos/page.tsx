"use client"
import { useState } from "react"
import { Wallet, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState("")
  const [validationStep, setValidationStep] = useState<"initial" | "validate" | "create">("initial")

  const handleProfileSelect = (value: string) => {
    setSelectedProfile(value)
    setValidationStep("validate")
  }

  const handleCreateWallet = () => {
    setValidationStep("create")
  }

  const profileEmojis: Record<string, string> = {
    aluno: "👦",
    escola: "🏫",
    merito: "🏅",
    governo: "🏛",
    oportunidade: "🌟",
  }

  const profileNames: Record<string, string> = {
    aluno: "Aluno",
    escola: "Escola",
    merito: "Instituição de Mérito",
    governo: "Governo",
    oportunidade: "Instituição de Oportunidade",
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <header className="py-6 px-4 md:px-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-900 mb-2">Passaporte Acadêmico On-Chain</h1>
        <p className="text-sky-700 max-w-2xl mx-auto">
          Visibilidade e Oportunidade para Todos — Conquistas Educacionais Registradas com Transparência e Privacidade.
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md shadow-lg border-sky-100">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-sky-900">Bem-vindo ao seu Passaporte Acadêmico</CardTitle>
            <CardDescription>Selecione seu perfil para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profile-select" className="sr-only">
                Selecione seu perfil
              </Label>
              <Select onValueChange={handleProfileSelect}>
                <SelectTrigger id="profile-select" className="w-full h-12 text-base">
                  <SelectValue placeholder="Selecione seu perfil de acesso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="aluno" className="text-base py-3">
                      <span className="flex items-center gap-2">
                        <span role="img" aria-label="Emoji de aluno">
                          👦
                        </span>{" "}
                        Aluno
                      </span>
                    </SelectItem>
                    <SelectItem value="escola" className="text-base py-3">
                      <span className="flex items-center gap-2">
                        <span role="img" aria-label="Emoji de escola">
                          🏫
                        </span>{" "}
                        Escola
                      </span>
                    </SelectItem>
                    <SelectItem value="merito" className="text-base py-3">
                      <span className="flex items-center gap-2">
                        <span role="img" aria-label="Emoji de instituição de mérito">
                          🏅
                        </span>{" "}
                        Instituição de Mérito
                      </span>
                    </SelectItem>
                    <SelectItem value="governo" className="text-base py-3">
                      <span className="flex items-center gap-2">
                        <span role="img" aria-label="Emoji de governo">
                          🏛
                        </span>{" "}
                        Governo
                      </span>
                    </SelectItem>
                    <SelectItem value="oportunidade" className="text-base py-3">
                      <span className="flex items-center gap-2">
                        <span role="img" aria-label="Emoji de instituição de oportunidade">
                          🌟
                        </span>{" "}
                        Instituição de Oportunidade
                      </span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {selectedProfile && validationStep === "validate" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                  <h3 className="font-medium text-sky-900 flex items-center gap-2 mb-2">
                    {profileEmojis[selectedProfile]} {profileNames[selectedProfile]}
                  </h3>
                  <p className="text-sm text-sky-700 mb-4">
                    Para acessar como {profileNames[selectedProfile]}, precisamos validar sua carteira blockchain.
                  </p>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="wallet-address" className="text-sm font-medium">
                        Endereço da Carteira
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="wallet-address"
                          placeholder="0x..."
                          className="flex-1"
                          value={walletAddress}
                          onChange={(e) => setWalletAddress(e.target.value)}
                        />
                        <Button variant="outline" size="icon" title="Conectar carteira">
                          <Wallet className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="link"
                        className="text-sky-600 p-0 h-auto font-normal"
                        onClick={handleCreateWallet}
                      >
                        Não tenho uma carteira
                      </Button>
                      <Button className="bg-sky-600 hover:bg-sky-700">Validar Acesso</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedProfile && validationStep === "create" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                  <h3 className="font-medium text-sky-900 flex items-center gap-2 mb-2">
                    <PlusCircle className="h-4 w-4" /> Criar Nova Carteira
                  </h3>
                  <p className="text-sm text-sky-700 mb-4">
                    Vamos criar uma nova carteira blockchain para você acessar como {profileNames[selectedProfile]}.
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-sm font-medium">
                          Nome
                        </Label>
                        <Input id="first-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-sm font-medium">
                          Sobrenome
                        </Label>
                        <Input id="last-name" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input id="email" type="email" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline" className="text-sky-600" onClick={() => setValidationStep("validate")}>
                        Voltar
                      </Button>
                      <Button className="bg-sky-600 hover:bg-sky-700">Criar Carteira</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {!selectedProfile && (
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-sky-600 max-w-xs text-center">
                O Passaporte Acadêmico On-Chain registra suas conquistas educacionais com segurança e transparência na
                blockchain.
              </p>
            </CardFooter>
          )}
        </Card>
      </main>

      <footer className="py-4 px-4 text-center text-sm text-sky-600">
        <p>© {new Date().getFullYear()} Passaporte Acadêmico On-Chain • Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
