"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const isHomePage = pathname === "/"

  // Função para rolagem suave
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const id = targetId.substring(1); // Remove o '#'
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start' // Garante que o topo do elemento fique no topo da viewport (após o offset do scroll-margin)
      });
    }
  };

  if (!mounted) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/hackathon-hacks.png" alt="Edu Wallet Logo" fill className="object-contain" priority />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent">
              Edu Wallet
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {isHomePage && (
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "#features")}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Funcionalidades
            </Link>
            <Link
              href="#team"
              onClick={(e) => handleSmoothScroll(e, "#team")}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Quem Somos
            </Link>
            <Link
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "#contact")}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contato
            </Link>
          </nav>
        )}

        <div className={`flex items-center gap-4 ${!isHomePage && !mobileMenuOpen ? 'ml-auto' : ''}`}>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/login" className="hidden md:block">
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full px-6">
              Entrar
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {isHomePage && (
                <>
                  <Link
                    href="#features"
                    className="py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={(e) => {
                      handleSmoothScroll(e, "#features");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Funcionalidades
                  </Link>
                  <Link
                    href="#team"
                    className="py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={(e) => {
                      handleSmoothScroll(e, "#team");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Quem Somos
                  </Link>
                  <Link
                    href="#contact"
                    className="py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={(e) => {
                      handleSmoothScroll(e, "#contact");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Contato
                  </Link>
                </>
              )}
              <Link
                href="/login"
                className="py-2 text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}