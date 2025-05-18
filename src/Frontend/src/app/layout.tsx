import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import "./globals.css"; // Mantenha seus estilos globais
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Nenhuma configuração de fonte aqui

export const metadata: Metadata = {
  title: "Edu Wallet - Seu Passaporte Acadêmico",
  description: "Plataforma para gerenciar sua identidade acadêmica e conquistas on-chain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Estime a altura da sua Navbar. Exemplo: se a Navbar tiver 72px de altura.
  // Tailwind: pt-16 (4rem = 64px), pt-20 (5rem = 80px).
  // Ajuste este valor conforme a altura REAL da sua Navbar.
  const NAVBAR_HEIGHT_PADDING = "pt-20"; // Exemplo: 80px. Ajuste!

  return (
    <html
      lang="pt-BR"
      // Removidas as variáveis da fonte Geist da classe do html.
      // 'antialiased' é uma boa classe para manter para suavização de fontes.
      className="antialiased"
      suppressHydrationWarning // Necessário com next-themes e SSR
    >
      {/*
        Você pode definir uma fonte padrão no body ou no globals.css se desejar.
        Exemplo: className="font-sans ..." no body para usar a stack sans-serif do Tailwind.
        Por padrão, o navegador usará suas fontes default.
      */}
      <body className="font-sans flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className={`flex-grow ${NAVBAR_HEIGHT_PADDING}`}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}