import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="py-12 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <div className="relative w-8 h-8">
              <Image src="/hackathon-hacks.png" alt="Edu Wallet Logo" fill className="object-contain" />
            </div>
            <span className="font-medium">Edu Wallet</span>
          </div>
          <div className="flex gap-8 mb-6 md:mb-0">
            <Link
              href="#features"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
            >
              Funcionalidades
            </Link>
            <Link
              href="#team"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
            >
              Quem Somos
            </Link>
            <Link
              href="#contact"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
            >
              Contato
            </Link>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Edu Wallet • Todos os direitos reservados
          </div>
        </div>
      </div>
    </footer>
  )
} 