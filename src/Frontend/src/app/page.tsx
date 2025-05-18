"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Menu, X, Moon, Sun, ChevronRight, Wallet, Shield, Award, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Passaporte Acadêmico{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
                  On-Chain
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
                Visibilidade e oportunidade para todos os estudantes através da tecnologia blockchain
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full px-8 py-6 text-lg font-medium flex items-center gap-2">
                  <span>Comece Agora</span>
                  <Wallet size={20} />
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 rounded-full px-8 py-6 text-lg font-medium flex items-center gap-2"
                >
                  <span>Saiba Mais</span>
                  <ChevronRight size={20} />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold mb-4">
              Principais{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
                Funcionalidades
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Uma infraestrutura descentralizada para registrar e rastrear o histórico acadêmico de alunos brasileiros
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section id="team" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold mb-4">
              Quem{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
                Nós Somos?
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Conheça a equipe por trás do Edu Wallet
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {/* Placeholder for team member photo */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <Users size={40} />
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-1">{member.name}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{member.role}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-3xl font-bold mb-6">
              Pronto para revolucionar a{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
                educação?
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Junte-se a nós nessa jornada para democratizar o acesso à visibilidade educacional e dar voz a milhares de
              jovens talentos.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full px-8 py-6 text-lg font-medium">
              Cadastre-se Agora
            </Button>
          </motion.div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  )
}

const features = [
  {
    title: "Registro Imutável",
    description:
      "Certificados e conquistas acadêmicas registradas em blockchain, garantindo autenticidade e imutabilidade dos dados.",
    icon: <Shield size={28} />,
  },
  {
    title: "Visibilidade Acadêmica",
    description:
      "Democratização do acesso à visibilidade educacional, dando destaque a talentos de todas as regiões do Brasil.",
    icon: <Users size={28} />,
  },
  {
    title: "Reconhecimento Digital",
    description:
      "NFTs de mérito acadêmico que substituem certificados tradicionais, com privacidade e segurança garantidas.",
    icon: <Award size={28} />,
  },
]

const teamMembers = [
  {
    name: "Ana Silva",
    role: "CEO & Fundadora",
    bio: "Especialista em blockchain e educação digital.",
  },
  {
    name: "Carlos Mendes",
    role: "CTO",
    bio: "Desenvolvedor blockchain com foco em soluções educacionais.",
  },
  {
    name: "Juliana Costa",
    role: "Designer UX/UI",
    bio: "Criadora de experiências digitais centradas no usuário.",
  },
  {
    name: "Rafael Santos",
    role: "Especialista em Educação",
    bio: "Pedagogo com experiência em tecnologias educacionais.",
  },
]
