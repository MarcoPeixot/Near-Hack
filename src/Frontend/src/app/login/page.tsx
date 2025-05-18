"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, FlagIcon as Government, School, GraduationCap, Award } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-32 h-32">
              <Image src="/hackathon-hacks.png" alt="Edu Wallet Logo" fill className="object-contain" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
            Entrar como
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedRole(role.id)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all shadow-sm ${
                  selectedRole === role.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-800/60"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full mb-3 shadow ${
                      selectedRole === role.id
                        ? "bg-blue-600 dark:bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
                    }`}
                  >
                    {role.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{role.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center">
            <Button
              disabled={!selectedRole}
              onClick={handleContinue}
              className={`w-full max-w-xs py-6 rounded-full font-medium text-center text-lg shadow-md transition-colors duration-200 ${
                selectedRole
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              Continuar
            </Button>

            <p className="mt-6 text-sm text-gray-700 dark:text-gray-300 text-center">
              Ao continuar, você concorda com os{' '}
              <Link href="/terms" className="text-blue-600 dark:text-blue-300 hover:underline transition-colors">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacy" className="text-blue-600 dark:text-blue-300 hover:underline transition-colors">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
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
