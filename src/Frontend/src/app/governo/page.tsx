"use client"
import { useState } from "react"
import { Wallet, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function GovernoValidaEscola() {
  const [walletAddress, setWalletAddress] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [status, setStatus] = useState<null | "success" | "error">(null)
  const [loading, setLoading] = useState(false)

  const [revokeAddress, setRevokeAddress] = useState("")
  const [revokeStatus, setRevokeStatus] = useState<null | "success" | "error">(null)
  const [revokeLoading, setRevokeLoading] = useState(false)

  const [checkAddress, setCheckAddress] = useState("")
  const [checkStatus, setCheckStatus] = useState<null | "authorized" | "unauthorized" | "error">(null)
  const [checkLoading, setCheckLoading] = useState(false)

  // Simulação de validação (substitua por chamada real à API/contrato)
  const handleValidate = async () => {
    setLoading(true)
    setStatus(null)
    // Simulação de delay e validação
    setTimeout(() => {
      if (walletAddress.startsWith("0x") && walletAddress.length > 10) {
        setStatus("success")
      } else {
        setStatus("error")
      }
      setLoading(false)
    }, 1200)
  }

  // Simulação de revogação
  const handleRevoke = async () => {
    setRevokeLoading(true)
    setRevokeStatus(null)
    setTimeout(() => {
      if (revokeAddress.startsWith("0x") && revokeAddress.length > 10) {
        setRevokeStatus("success")
      } else {
        setRevokeStatus("error")
      }
      setRevokeLoading(false)
    }, 1200)
  }

  // Simulação de verificação
  const handleCheck = async () => {
    setCheckLoading(true)
    setCheckStatus(null)
    setTimeout(() => {
      if (checkAddress.startsWith("0x") && checkAddress.length > 10) {
        // Simula que carteiras terminadas em 'a' são autorizadas
        if (checkAddress.trim().toLowerCase().endsWith("a")) {
          setCheckStatus("authorized")
        } else {
          setCheckStatus("unauthorized")
        }
      } else {
        setCheckStatus("error")
      }
      setCheckLoading(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <header className="py-6 px-4 md:px-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-900 mb-2">Governo - Validação de Escola</h1>
        <p className="text-sky-700 max-w-2xl mx-auto">
          Como governo, valide o endereço de carteira de uma escola.
        </p>
      </header>

      {/* Container único para os cards */}
      <main className="flex-1 flex flex-row items-center justify-center p-4 md:p-8 gap-8 flex-wrap">
        {/* Card 1: Validar Escola */}
        <Card className="w-full max-w-md shadow-lg border-sky-100">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-sky-900">Validar Escola</CardTitle>
            <CardDescription>Insira os dados da escola para validar o acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="school-name" className="text-sm font-medium">
                      Nome da Escola (opcional)
                    </Label>
                    <Input
                      id="school-name"
                      placeholder="Nome da escola"
                      className="flex-1"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wallet-address" className="text-sm font-medium">
                      Endereço da Carteira da Escola
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="wallet-address"
                        placeholder="0x..."
                        className="flex-1"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        disabled={loading}
                      />
                      <Button variant="outline" size="icon" title="Conectar carteira" disabled>
                        <Wallet className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-end pt-2">
                    <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleValidate} disabled={loading}>
                      {loading ? "Validando..." : "Validar como Escola"}
                    </Button>
                  </div>
                  {status === "success" && (
                    <div className="flex items-center gap-2 text-green-700 mt-2">
                      <CheckCircle className="h-5 w-5" /> Endereço validado como escola com sucesso!
                    </div>
                  )}
                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-700 mt-2">
                      <XCircle className="h-5 w-5" /> Endereço inválido. Tente novamente.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Revogar Escola */}
        <Card className="w-full max-w-md shadow-lg border-sky-100">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-sky-900">Revogar Escola</CardTitle>
            <CardDescription>Revogue o status de escola de um endereço</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="revoke-address" className="text-sm font-medium">
                Endereço da Carteira
              </Label>
              <div className="flex gap-2">
                <Input
                  id="revoke-address"
                  placeholder="0x..."
                  className="flex-1"
                  value={revokeAddress}
                  onChange={(e) => setRevokeAddress(e.target.value)}
                  disabled={revokeLoading}
                />
                <Button className="bg-red-600 hover:bg-red-700" onClick={handleRevoke} disabled={revokeLoading}>
                  {revokeLoading ? "Revogando..." : "Revogar"}
                </Button>
              </div>
              {revokeStatus === "success" && (
                <div className="flex items-center gap-2 text-green-700 mt-2">
                  <CheckCircle className="h-5 w-5" /> Escola revogada com sucesso!
                </div>
              )}
              {revokeStatus === "error" && (
                <div className="flex items-center gap-2 text-red-700 mt-2">
                  <XCircle className="h-5 w-5" /> Endereço inválido. Tente novamente.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Verificar Escola */}
        <Card className="w-full max-w-md shadow-lg border-sky-100">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-sky-900">Verificar Escola</CardTitle>
            <CardDescription>Verifique se um endereço é uma escola autorizada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="check-address" className="text-sm font-medium">
                Endereço da Carteira
              </Label>
              <div className="flex gap-2">
                <Input
                  id="check-address"
                  placeholder="0x..."
                  className="flex-1"
                  value={checkAddress}
                  onChange={(e) => setCheckAddress(e.target.value)}
                  disabled={checkLoading}
                />
                <Button className="bg-sky-600 hover:bg-sky-700" onClick={handleCheck} disabled={checkLoading}>
                  {checkLoading ? "Verificando..." : "Verificar"}
                </Button>
              </div>
              {checkStatus === "authorized" && (
                <div className="flex items-center gap-2 text-green-700 mt-2">
                  <CheckCircle className="h-5 w-5" /> Endereço autorizado como escola!
                </div>
              )}
              {checkStatus === "unauthorized" && (
                <div className="flex items-center gap-2 text-yellow-700 mt-2">
                  <XCircle className="h-5 w-5" /> Endereço NÃO é uma escola autorizada.
                </div>
              )}
              {checkStatus === "error" && (
                <div className="flex items-center gap-2 text-red-700 mt-2">
                  <XCircle className="h-5 w-5" /> Endereço inválido. Tente novamente.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="py-4 px-4 text-center text-sm text-sky-600">
        <p>© {new Date().getFullYear()} Passaporte Acadêmico On-Chain • Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
