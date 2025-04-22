"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { ArrowRight, BarChart3, DollarSign, LineChart, Shield, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function LandingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user")
        const data = await response.json()

        console.log("Verificação de autenticação:", data)

        if (response.ok && data.user) {
          setIsAuthenticated(true)
          router.push("/dashboard")
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Mostrar nada enquanto verifica a autenticação para evitar flash de conteúdo
  if (isLoading) {
    return null
  }

  // Se o usuário estiver autenticado, ele será redirecionado para o dashboard
  // Este retorno só será renderizado se o usuário não estiver autenticado
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <BarChart3 className="h-6 w-6" />
            <span>Trade Platform</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </Link>
            <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Depoimentos
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Registrar</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 sm:py-32">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter">
              Plataforma de Trading Avançada
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Opere com confiança usando nossa plataforma intuitiva e poderosa. Comece com uma conta demo e evolua para
              operações reais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Começar agora <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Fazer login
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="container py-24 sm:py-32 border-t">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <LineChart className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Gráficos Avançados</CardTitle>
                <CardDescription>
                  Acesse gráficos profissionais com TradingView integrado para análise técnica completa.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>CopyTrader</CardTitle>
                <CardDescription>
                  Siga traders experientes e copie suas operações automaticamente para maximizar seus resultados.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Conta Demo</CardTitle>
                <CardDescription>
                  Pratique sem riscos com $10.000 em dinheiro virtual antes de investir dinheiro real.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <DollarSign className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Payout Competitivo</CardTitle>
                <CardDescription>
                  Ganhe até 85% de retorno em operações bem-sucedidas com nossa plataforma.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section id="pricing" className="container py-24 sm:py-32 border-t">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Preços Simples e Transparentes
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Comece gratuitamente e pague apenas quando estiver pronto para investir.
            </p>
          </div>
          <div className="grid gap-8 mt-8 md:grid-cols-2 lg:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Conta Demo</CardTitle>
                <CardDescription>Perfeita para iniciantes e para testar estratégias.</CardDescription>
                <div className="mt-4 text-4xl font-bold">$0</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <span className="text-sm">✓ $10.000 em dinheiro virtual</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sm">✓ Acesso a todos os ativos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sm">✓ Gráficos TradingView</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sm">✓ Histórico de operações</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/register" className="w-full">
                  <Button className="w-full">Começar Grátis</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Conta Real</CardTitle>
                <CardDescription>Para traders que querem operar com dinheiro real.</CardDescription>
                <div className="mt-4 text-4xl font-bold">Depósito Mínimo</div>
                <div className="text-2xl font-bold text-primary">$100</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <span className="text-sm">✓ Operações com dinheiro real</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sm">✓ Payout de 85% por operação</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sm">✓ Saques rápidos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sm">✓ Suporte prioritário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sm">✓ CopyTrader</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/register" className="w-full">
                  <Button className="w-full">Abrir Conta Real</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 font-bold">
            <BarChart3 className="h-5 w-5" />
            <span>Trade Platform</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Trade Platform. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
