"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, FlagIcon as Government, School, GraduationCap, Award } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Login() {
  const [mounted, setMounted] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const { theme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleContinue = () => {
    if (!selectedRole) return
    if (selectedRole === "governo") router.push("/governo")
    else if (selectedRole === "escola") router.push("/escola")
    else if (selectedRole === "instituicao") router.push("/instituicao/login")
    else if (selectedRole === "instituicao_oportunidade") router.push("/instituicao/map")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="py-6 px-4 md:px-8 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar para a página inicial</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-32 h-32">
              <Image src="/hackathon-hacks.png" alt="Edu Wallet Logo" fill className="object-contain" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Entrar como</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedRole(role.id)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  selectedRole === role.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full mb-3 ${
                      selectedRole === role.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {role.icon}
                  </div>
                  <h3 className="font-medium">{role.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center">
            <Button
              disabled={!selectedRole}
              onClick={handleContinue}
              className={`w-full max-w-xs py-6 rounded-full font-medium text-center ${
                selectedRole
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Continuar
            </Button>

            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
              Ao continuar, você concorda com os{" "}
              <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="py-6 px-4 md:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Edu Wallet • Todos os direitos reservados
      </footer>
    </div>
  )
}

const roles = [
  {
    id: "governo",
    title: "Governo",
    icon: <Government size={24} />,
  },
  {
    id: "escola",
    title: "Escola",
    icon: <School size={24} />,
  },
  {
    id: "instituicao_oportunidade",
    title: "Instituição de Oportunidade",
    icon: <Award size={24} />,
  },
  {
    id: "instituicao",
    title: "Instituição",
    icon: <Award size={24} />,
  },
]
