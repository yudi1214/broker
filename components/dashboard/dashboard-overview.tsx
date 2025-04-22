"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, DollarSign, LineChart, TrendingDown, TrendingUp, Users } from "lucide-react"
import { useAccountStore } from "@/lib/stores/account-store"
import { useUserStore } from "@/lib/stores/user-store"
import { useTradeStore } from "@/lib/stores/trade-store"
import { formatCurrency } from "@/lib/utils"
import { RecentTradesTable } from "../trade/recent-trades-table"
import { Button } from "../ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { OverviewChart } from "./overview-chart"

export function DashboardOverview() {
  const { accountType } = useAccountStore()
  const { user } = useUserStore()
  const { trades } = useTradeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const filteredTrades = trades.filter((trade) => trade.accountType === accountType)
  const recentTrades = filteredTrades.slice(0, 5)

  const totalWins = filteredTrades.filter((trade) => trade.result === "win").length
  const totalLosses = filteredTrades.filter((trade) => trade.result === "loss").length
  const winRate = filteredTrades.length > 0 ? ((totalWins / filteredTrades.length) * 100).toFixed(1) : "0.0"

  const balance = accountType === "demo" ? user?.demoBalance : user?.realBalance

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/trade">
            <Button>Operar Agora</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(balance || 0)}</div>
                <p className="text-xs text-muted-foreground">Conta {accountType === "demo" ? "Demo" : "Real"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{winRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {totalWins} ganhos / {totalLosses} perdas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operações</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredTrades.length}</div>
                <p className="text-xs text-muted-foreground">Total de operações realizadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Traders Seguidos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">Traders que você segue</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Desempenho</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Operações Recentes</CardTitle>
                <CardDescription>Suas últimas 5 operações</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTradesTable trades={recentTrades} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Distribuição por Ativo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Gráfico de distribuição por ativo
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resultados por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Gráfico de resultados por hora
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Melhores Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-full flex items-center">
                      <span className="font-medium">BTC/USD</span>
                      <div className="ml-auto flex items-center">
                        <TrendingUp className="mr-1 h-4 w-4 text-success" />
                        <span className="text-success">78%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full flex items-center">
                      <span className="font-medium">ETH/USD</span>
                      <div className="ml-auto flex items-center">
                        <TrendingUp className="mr-1 h-4 w-4 text-success" />
                        <span className="text-success">65%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full flex items-center">
                      <span className="font-medium">EUR/USD</span>
                      <div className="ml-auto flex items-center">
                        <TrendingDown className="mr-1 h-4 w-4 text-destructive" />
                        <span className="text-destructive">42%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Histórico de Resultados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-full flex items-center">
                      <span className="font-medium">Hoje</span>
                      <div className="ml-auto flex items-center gap-2">
                        <div className="flex items-center">
                          <ArrowUp className="mr-1 h-4 w-4 text-success" />
                          <span>4</span>
                        </div>
                        <div className="flex items-center">
                          <ArrowDown className="mr-1 h-4 w-4 text-destructive" />
                          <span>2</span>
                        </div>
                        <span className="font-medium text-success">{formatCurrency(120)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full flex items-center">
                      <span className="font-medium">Esta semana</span>
                      <div className="ml-auto flex items-center gap-2">
                        <div className="flex items-center">
                          <ArrowUp className="mr-1 h-4 w-4 text-success" />
                          <span>12</span>
                        </div>
                        <div className="flex items-center">
                          <ArrowDown className="mr-1 h-4 w-4 text-destructive" />
                          <span>5</span>
                        </div>
                        <span className="font-medium text-success">{formatCurrency(450)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full flex items-center">
                      <span className="font-medium">Este mês</span>
                      <div className="ml-auto flex items-center gap-2">
                        <div className="flex items-center">
                          <ArrowUp className="mr-1 h-4 w-4 text-success" />
                          <span>35</span>
                        </div>
                        <div className="flex items-center">
                          <ArrowDown className="mr-1 h-4 w-4 text-destructive" />
                          <span>18</span>
                        </div>
                        <span className="font-medium text-success">{formatCurrency(1250)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
