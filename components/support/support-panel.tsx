"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dados simulados de tickets
const tickets = [
  {
    id: "1",
    subject: "Problema com depósito",
    status: "open",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    messages: [
      {
        id: "1",
        content:
          "Olá, fiz um depósito via PIX há 2 horas e ainda não foi creditado na minha conta. O comprovante está anexado.",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: "2",
        content: "Olá! Obrigado por entrar em contato. Vamos verificar o seu depósito e retornaremos em breve.",
        sender: "support",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      },
    ],
  },
  {
    id: "2",
    subject: "Dúvida sobre saque",
    status: "closed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    messages: [
      {
        id: "1",
        content: "Qual o prazo para processamento de saques?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
      {
        id: "2",
        content: "Olá! Os saques são processados em até 24 horas úteis após a aprovação.",
        sender: "support",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
      },
      {
        id: "3",
        content: "Obrigado pela informação!",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
      },
    ],
  },
]

// Dados simulados de FAQs
const faqs = [
  {
    question: "Como faço um depósito?",
    answer:
      "Para fazer um depósito, acesse a seção 'Financeiro' no menu, selecione a aba 'Depósito', informe o valor desejado e clique em 'Gerar PIX'. Escaneie o QR Code ou copie o código PIX para realizar o pagamento.",
  },
  {
    question: "Qual o prazo para processamento de saques?",
    answer:
      "Os saques são processados em até 24 horas úteis após a aprovação. O valor será transferido para a conta bancária associada à chave PIX informada no momento do saque.",
  },
  {
    question: "Como funciona o Copy Trading?",
    answer:
      "O Copy Trading permite que você copie automaticamente as operações de traders experientes. Basta acessar a seção 'Copy Trader', escolher um trader para seguir e suas operações serão replicadas na sua conta de acordo com as configurações definidas.",
  },
  {
    question: "Posso operar em conta demo?",
    answer:
      "Sim, oferecemos uma conta demo com saldo virtual para que você possa praticar suas estratégias sem risco. Para alternar entre as contas demo e real, clique no saldo exibido no topo da tela.",
  },
  {
    question: "Como verificar minha conta?",
    answer:
      "Para verificar sua conta, acesse seu perfil, vá até a aba 'Documentos' e envie os documentos solicitados (documento de identidade e comprovante de residência). A verificação é necessária para realizar saques.",
  },
]

export function SupportPanel() {
  const { toast } = useToast()
  const [activeTicket, setActiveTicket] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [newTicketSubject, setNewTicketSubject] = useState("")
  const [newTicketMessage, setNewTicketMessage] = useState("")
  const [newTicketCategory, setNewTicketCategory] = useState("deposit")

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsLoading(true)

    try {
      // Simular envio de mensagem
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso",
      })

      setNewMessage("")
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTicketSubject.trim() || !newTicketMessage.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simular criação de ticket
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Ticket criado",
        description: "Seu ticket foi criado com sucesso. Em breve entraremos em contato",
      })

      setNewTicketSubject("")
      setNewTicketMessage("")
      setNewTicketCategory("deposit")
    } catch (error) {
      toast({
        title: "Erro ao criar ticket",
        description: "Ocorreu um erro ao criar seu ticket. Tente novamente mais tarde",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Suporte</h2>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Meus Tickets</TabsTrigger>
          <TabsTrigger value="new">Novo Ticket</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Tickets</CardTitle>
                <CardDescription>Seus tickets de suporte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tickets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Você não possui tickets de suporte
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div
                      key={ticket.id}

\
