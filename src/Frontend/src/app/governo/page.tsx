"use client"
import { useState, useEffect } from "react"
import { Wallet, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Web3 from "web3"
import { contractABI } from "@/lib/contractABI"
import { useRouter } from "next/navigation"

const CONTRACT_ADDRESS = "0xD4c77dF18E8c6cA4b6022089ef040e17523A447a"

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

  const [web3, setWeb3] = useState<any>(null)
  const [contract, setContract] = useState<any>(null)
  const [account, setAccount] = useState<string>("")
  const [walletError, setWalletError] = useState<string | null>(null)

  const router = useRouter()

  const roleToPath: Record<string, string> = {
    governo: "/governo",
    escola: "/escola",
    instituicao: "/instituicao/login",
  }

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const w3 = new Web3((window as any).ethereum)
      setWeb3(w3)
      ;(async () => {
        try {
          await (window as any).ethereum.request({ method: "eth_requestAccounts" })
          const accounts = await w3.eth.getAccounts()
          setAccount(accounts[0])
          setContract(new w3.eth.Contract(contractABI as any, CONTRACT_ADDRESS))
        } catch (err) {
          setWalletError("Falha ao conectar à carteira.")
        }
      })()
    } else {
      setWalletError("MetaMask não detectado.")
    }
  }, [])

  const handleValidate = async () => {
    setLoading(true)
    setStatus(null)
    setWalletError(null)
    try {
      if (!web3 || !contract || !account) {
        setWalletError("Carteira não conectada.")
        setStatus("error")
        setLoading(false)
        return
      }
      const already = await contract.methods.isAuthorizedSchool(walletAddress).call()
      if (already) {
        setStatus("success")
        setLoading(false)
        return
      }
      await contract.methods.authorizeSchool(walletAddress).send({ from: account })
      setStatus("success")
    } catch (err) {
      setStatus("error")
      setWalletError("Erro ao validar escola.")
    }
    setLoading(false)
  }

  const handleRevoke = async () => {
    setRevokeLoading(true)
    setRevokeStatus(null)
    setWalletError(null)
    try {
      if (!web3 || !contract || !account) {
        setWalletError("Carteira não conectada.")
        setRevokeStatus("error")
        setRevokeLoading(false)
        return
      }
      await contract.methods.revokeSchool(revokeAddress).send({ from: account })
      setRevokeStatus("success")
    } catch (err) {
      setRevokeStatus("error")
      setWalletError("Erro ao revogar escola.")
    }
    setRevokeLoading(false)
  }

  const handleCheck = async () => {
    setCheckLoading(true)
    setCheckStatus(null)
    setWalletError(null)
    try {
      if (!web3 || !contract) {
        setWalletError("Carteira não conectada.")
        setCheckStatus("error")
        setCheckLoading(false)
        return
      }
      const result = await contract.methods.isAuthorizedSchool(checkAddress).call()
      setCheckStatus(result ? "authorized" : "unauthorized")
    } catch (err) {
      setCheckStatus("error")
      setWalletError("Erro ao verificar escola.")
    }
    setCheckLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <header className="py-6 px-4 md:px-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-900 dark:text-sky-100 mb-2">Governo - Validação de Escola</h1>
        <p className="text-sky-700 dark:text-sky-300 max-w-2xl mx-auto">
          Como governo, valide o endereço de carteira de uma escola.
        </p>
        {walletError && (
          <div className="text-red-600 dark:text-red-400 mt-2">{walletError}</div>
        )}
        {account && (
          <div className="text-xs text-sky-700 dark:text-sky-300 mt-1">Carteira conectada: {account}</div>
        )}
      </header>

      <main className="flex-1 flex flex-row items-center justify-center p-4 md:p-8 gap-8 flex-wrap">
        <Card className="w-full max-w-md shadow-lg border-sky-100 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-sky-900 dark:text-sky-100">Validar Escola</CardTitle>
            <CardDescription className="dark:text-gray-300">Insira os dados da escola para validar o acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-sky-50 dark:bg-gray-800 p-4 rounded-lg border border-sky-100 dark:border-gray-700">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="school-name" className="text-sm font-medium dark:text-gray-200">
                      Nome da Escola (opcional)
                    </Label>
                    <Input
                      id="school-name"
                      placeholder="Nome da escola"
                      className="flex-1 bg-white dark:bg-gray-900 text-sky-900 dark:text-sky-100 border border-sky-200 dark:border-gray-700"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wallet-address" className="text-sm font-medium dark:text-gray-200">
                      Endereço da Carteira da Escola
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="wallet-address"
                        placeholder="0x..."
                        className="flex-1 bg-white dark:bg-gray-900 text-sky-900 dark:text-sky-100 border border-sky-200 dark:border-gray-700"
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
                    <Button className="bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700" onClick={handleValidate} disabled={loading}>
                      {loading ? "Validando..." : "Validar como Escola"}
                    </Button>
                  </div>
                  {status === "success" && (
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mt-2">
                      <CheckCircle className="h-5 w-5" /> Endereço validado como escola com sucesso!
                    </div>
                  )}
                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mt-2">
                      <XCircle className="h-5 w-5" /> Endereço inválido. Tente novamente.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md shadow-lg border-sky-100 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-sky-900 dark:text-sky-100">Revogar Escola</CardTitle>
            <CardDescription className="dark:text-gray-300">Revogue o status de escola de um endereço</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="revoke-address" className="text-sm font-medium dark:text-gray-200">
                Endereço da Carteira
              </Label>
              <div className="flex gap-2">
                <Input
                  id="revoke-address"
                  placeholder="0x..."
                  className="flex-1 bg-white dark:bg-gray-900 text-sky-900 dark:text-sky-100 border border-sky-200 dark:border-gray-700"
                  value={revokeAddress}
                  onChange={(e) => setRevokeAddress(e.target.value)}
                  disabled={revokeLoading}
                />
                <Button className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800" onClick={handleRevoke} disabled={revokeLoading}>
                  {revokeLoading ? "Revogando..." : "Revogar"}
                </Button>
              </div>
              {revokeStatus === "success" && (
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mt-2">
                  <CheckCircle className="h-5 w-5" /> Escola revogada com sucesso!
                </div>
              )}
              {revokeStatus === "error" && (
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mt-2">
                  <XCircle className="h-5 w-5" /> Endereço inválido. Tente novamente.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md shadow-lg border-sky-100 dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-sky-900 dark:text-sky-100">Verificar Escola</CardTitle>
            <CardDescription className="dark:text-gray-300">Verifique se um endereço é uma escola autorizada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="check-address" className="text-sm font-medium dark:text-gray-200">
                Endereço da Carteira
              </Label>
              <div className="flex gap-2">
                <Input
                  id="check-address"
                  placeholder="0x..."
                  className="flex-1 bg-white dark:bg-gray-900 text-sky-900 dark:text-sky-100 border border-sky-200 dark:border-gray-700"
                  value={checkAddress}
                  onChange={(e) => setCheckAddress(e.target.value)}
                  disabled={checkLoading}
                />
                <Button className="bg-sky-600 hover:bg-sky-700 dark:bg-blue-600 dark:hover:bg-blue-700" onClick={handleCheck} disabled={checkLoading}>
                  {checkLoading ? "Verificando..." : "Verificar"}
                </Button>
              </div>
              {checkStatus === "authorized" && (
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mt-2">
                  <CheckCircle className="h-5 w-5" /> Endereço autorizado como escola!
                </div>
              )}
              {checkStatus === "unauthorized" && (
                <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 mt-2">
                  <XCircle className="h-5 w-5" /> Endereço NÃO é uma escola autorizada.
                </div>
              )}
              {checkStatus === "error" && (
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mt-2">
                  <XCircle className="h-5 w-5" /> Endereço inválido. Tente novamente.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      
    </div>
  )
}
