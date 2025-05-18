"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Bot, Send, User, X, Sparkles, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import OpenAI from "openai" // Importa a biblioteca da OpenAI

type Message = {
  id: string
  role: "user" | "assistant" | "system" // OpenAI usa "assistant" para o modelo e "system" para instruções
  content: string
}

// Obtenha a API Key da variável de ambiente
const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ""
if (!API_KEY) {
  console.warn(
    "Chave da API da OpenAI não configurada. Verifique seu arquivo .env.local. O chat não funcionará."
  )
}

// Inicializa o cliente da OpenAI
// IMPORTANTE: dangerouslyAllowBrowser expõe sua chave de API ao navegador.
// Para produção, é fortemente recomendado fazer chamadas de API através de um endpoint de backend.
const openai = API_KEY
  ? new OpenAI({
      apiKey: API_KEY,
      dangerouslyAllowBrowser: true, // Necessário para uso no cliente
    })
  : null

export function EduAssist() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-assistant-message",
      role: "assistant", // OpenAI usa "assistant"
      content:
        "Olá! Sou o EduAssist, seu assistente acadêmico. Como posso ajudar você hoje?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !openai) {
      if (!openai) {
        console.error("Cliente OpenAI não inicializado. Verifique a API Key.")
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content:
              "Erro: A chave da API da OpenAI não está configurada corretamente. O chat não pode funcionar.",
          },
        ])
      }
      return
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      const systemInstruction = `Você é o EduAssist, um assistente acadêmico especializado do Edu Wallet, uma plataforma de passaporte acadêmico on-chain.
      
      Informações sobre o Edu Wallet:
      - Utiliza blockchain para registrar conquistas acadêmicas como NFTs
      - Conecta alunos, escolas, instituições de mérito e oportunidades
      - Foca em dar visibilidade a talentos de regiões periféricas
      - Usa tecnologia zkVerify para privacidade
      
      Suas capacidades incluem:
      - Explicar como funciona o sistema de passaporte acadêmico
      - Ajudar a interpretar certificados e conquistas
      - Sugerir oportunidades baseadas no perfil acadêmico
      - Orientar sobre como maximizar a visibilidade do perfil
      - Responder dúvidas sobre blockchain, NFTs e privacidade de dados
      
      Seja sempre útil, conciso e amigável. Foque em fornecer valor educacional.
      Responda em Português do Brasil.`

      // Prepara as mensagens para a API da OpenAI
      const apiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: systemInstruction,
        },
        // Mapeia o histórico de mensagens, convertendo "model" (Gemini) para "assistant" (OpenAI) se necessário
        // e garantindo que não incluímos mensagens "system" do nosso estado interno aqui.
        ...newMessages
          .filter((msg) => msg.role === "user" || msg.role === "assistant") // Filtra apenas user e assistant
          .map((msg) => ({
            role: msg.role as "user" | "assistant", // Type assertion
            content: msg.content,
          })),
      ]

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Ou "gpt-4", "gpt-4-turbo-preview", etc.
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1024, // Ajuste conforme necessário (OpenAI usa max_tokens)
        // top_p: 1, // Equivalente ao topP do Gemini
      })

      const assistantResponse =
        completion.choices[0]?.message?.content?.trim() ||
        "Desculpe, não consegui gerar uma resposta."

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: assistantResponse,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Erro ao gerar resposta do OpenAI:", error)
      let errorMessageContent =
        "Desculpe, tive um problema ao processar sua solicitação. Poderia tentar novamente?"
      if (error instanceof OpenAI.APIError) {
        // Erros específicos da API da OpenAI
        if (error.status === 401) {
          errorMessageContent =
            "Erro: A chave da API da OpenAI não é válida ou não foi configurada corretamente."
        } else if (error.status === 429) {
          errorMessageContent =
            "Erro: Limite de taxa da API excedido. Por favor, tente novamente mais tarde."
        } else if (error.message.toLowerCase().includes("safety") || error.code === 'content_policy_violation') {
          errorMessageContent =
            "Sua solicitação foi bloqueada devido às políticas de conteúdo. Tente reformular sua pergunta."
        } else {
            errorMessageContent = `Erro da API OpenAI: ${error.message}`
        }
      }


      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: errorMessageContent,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full w-14 h-14 shadow-lg ${
            isOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          }`}
          aria-label={isOpen ? "Fechar assistente" : "Abrir assistente"}
        >
          {isOpen ? <X size={24} /> : <Sparkles size={24} />}
        </Button>
      </div>

      {/* Janela do chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-full max-w-md h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 z-50"
          >
            {/* Cabeçalho */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-blue-50 dark:bg-blue-900/30 flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white mr-3">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  EduAssist
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Seu assistente acadêmico inteligente
                </p>
              </div>
            </div>

            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.role === "user"
                        ? "bg-blue-600 dark:bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start mb-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                          message.role === "user"
                            ? "bg-blue-700 dark:bg-blue-600"
                            : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User size={14} />
                        ) : (
                          <Bot size={14} />
                        )}
                      </div>
                      <span className="text-xs font-medium">
                        {message.role === "user" ? "Você" : "EduAssist"}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mb-4 flex justify-start">
                  <div className="max-w-[80%] rounded-2xl p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                        <Bot size={14} />
                      </div>
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Área de input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem..."
                  className="resize-none min-h-[60px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  disabled={isLoading || !API_KEY || !openai}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || !API_KEY || !openai}
                  className="h-10 w-10 rounded-full p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Send size={18} />
                </Button>
              </div>
              {(!API_KEY || !openai) && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                  A API Key da OpenAI não está configurada ou é inválida. O chat não funcionará.
                </p>
              )}
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Lightbulb size={12} className="mr-1" />
                <span>
                  Dica: Pergunte sobre oportunidades, certificados ou como
                  funciona o sistema
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}