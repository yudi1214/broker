"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useAccountStore } from "@/lib/stores/account-store"
import { useUserStore } from "@/lib/stores/user-store"
import { formatCurrency } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Check, Search, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

// Dados simulados de traders
const topTraders = [
  {
    id: "1",
    name: "Alex Trader",
    image: "",
    winRate: 78,
    followers: 1245,
    profit: 12500,
    trades: 156,
    description: "Especialista em criptomoedas com foco em BTC e ETH",
  },
  {
    id: "2",
    name: "Maria Invest",
    image: "",
    winRate: 72,
    followers: 987,
    profit: 9800,
    trades: 203,
    description: "Análise técnica em forex e commodities",
  },
  {
    id: "3",
    name: "Carlos Forex",
    image: "",
    winRate: 68,
    followers: 756,
    profit: 7600,
    trades: 178,
    description: "Especialista em pares de moedas EUR/USD e GBP/USD",
  },
  {
    id: "4",
    name: "Julia Stocks",
    image: "",
    winRate: 65,
    followers: 543,
    profit: 6500,
    trades: 132,
    description: "Foco em ações de tecnologia e healthcare",
  },
]

// Histórico simulado de cópias
const copyHistory = [
  {
    id: "1",
    traderId: "1",
    traderName: "Alex Trader",
    asset: "BTC/USD",
    direction: "up",
    amount: 100,
    result: "win",
    profit: 85,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    traderId: "2",
    traderName: "Maria Invest",
    asset: "EUR/USD",
    direction: "down",
    amount: 50,
    result: "loss",
    profit: -50,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "3",
    traderId: "1",
    traderName: "Alex Trader",
    asset: "ETH/USD",
    direction: "up",
    amount: 75,
    result: "win",
    profit: 63.75,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
]

export function CopyTrader() {
  const { accountType } = useAccountStore()
  const { user } = useUserStore()
  const { toast } = useToast()

  const [isCopyable, setIsCopyable] = useState(false)
  const [followedTraders, setFollowedTraders] = useState<string[]>([])
  const [copyHistoryData, setCopyHistoryData] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Detectar se é mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  useEffect(() => {
    // Simular carregamento de dados
    setFollowedTraders(["1", "3"])
    setCopyHistoryData(copyHistory)
  }, [])

  const handleToggleCopyable = () => {
    setIsCopyable(!isCopyable)
    toast({
      title: !isCopyable ? "Modo copiável ativado" : "Modo copiável desativado",
      description: !isCopyable
        ? "Outros traders agora podem copiar suas operações"
        : "Outros traders não podem mais copiar suas operações",
    })
  }

  const handleFollowTrader = (traderId: string) => {
    if (followedTraders.includes(traderId)) {
      setFollowedTraders(followedTraders.filter((id) => id !== traderId))
      toast({
        title: "Trader removido",
        description: "Você não está mais seguindo este trader",
      })
    } else {
      setFollowedTraders([...followedTraders, traderId])
      toast({
        title: "Trader seguido",
        description: "Você agora está seguindo este trader",
      })
    }
  }

  // Filtrar traders com base na busca
  const filteredTraders = topTraders.filter((trader) => trader.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Componente de card de trader
  const TraderCard = ({ trader }: { trader: (typeof topTraders)[0] }) => (
    <Card key={trader.id} className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={trader.image} alt={trader.name} />
            <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{trader.name}</CardTitle>
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="mr-1 h-3 w-3" />
              {trader.followers} seguidores
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <p className="text-sm text-muted-foreground mb-2">{trader.description}</p>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-md bg-muted p-2">
            <div className="font-medium">{trader.winRate}%</div>
            <div className="text-xs text-muted-foreground">Taxa</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <div className="font-medium">{trader.trades}</div>
            <div className="text-xs text-muted-foreground">Trades</div>
          </div>
          <div className="rounded-md bg-muted p-2">
            <div className="font-medium text-success">+{formatCurrency(trader.profit)}</div>
            <div className="text-xs text-muted-foreground">Lucro</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant={followedTraders.includes(trader.id) ? "default" : "outline"}
          className="w-full"
          onClick={() => handleFollowTrader(trader.id)}
        >
          {followedTraders.includes(trader.id) ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Seguindo
            </>
          ) : (
            "Seguir Trader"
          )}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Copy Trader</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Copy Trading</CardTitle>
          <CardDescription>Configure suas preferências para copiar outros traders ou ser copiado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center space-x-2">
              <Switch id="copyable" checked={isCopyable} onCheckedChange={handleToggleCopyable} />
              <Label htmlFor="copyable">Quero ser copiado</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Ative esta opção para permitir que outros usuários copiem suas operações automaticamente
            </p>
          </div>

          <div className="rounded-md border p-4">
            <div className="flex flex-col space-y-1.5">
              <h3 className="text-sm font-medium">Informações da sua conta</h3>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Tipo de conta:</div>
                <Badge variant={accountType === "demo" ? "warning" : "success"}>
                  {accountType === "demo" ? "DEMO" : "REAL"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Saldo:</div>
                <div className="font-medium">
                  {formatCurrency(accountType === "demo" ? user?.demoBalance || 0 : user?.realBalance || 0)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Seguidores:</div>
                <div className="font-medium">{isCopyable ? "32" : "0"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="top-traders" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger value="top-traders" className="flex-1">
            Top Traders
          </TabsTrigger>
          <TabsTrigger value="followed" className="flex-1">
            Traders Seguidos
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="top-traders" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar traders..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTraders.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Nenhum trader encontrado com este nome
              </div>
            ) : (
              filteredTraders.map((trader) => <TraderCard key={trader.id} trader={trader} />)
            )}
          </div>
        </TabsContent>

        <TabsContent value="followed" className="space-y-4">
          {followedTraders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum trader seguido</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Você ainda não está seguindo nenhum trader. Vá para a aba "Top Traders" para encontrar traders para
                  seguir.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topTraders
                .filter((trader) => followedTraders.includes(trader.id))
                .map((trader) => (
                  <TraderCard key={trader.id} trader={trader} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Operações Copiadas</CardTitle>
              <CardDescription>
                Operações realizadas automaticamente a partir dos traders que você segue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {copyHistoryData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhuma operação copiada ainda</div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trader</TableHead>
                        <TableHead>Ativo</TableHead>
                        <TableHead>Direção</TableHead>
                        {!isMobile && <TableHead>Valor</TableHead>}
                        <TableHead>Resultado</TableHead>
                        <TableHead className="text-right">Retorno</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {copyHistoryData.map((copy) => (
                        <TableRow key={copy.id}>
                          <TableCell className="font-medium">{copy.traderName}</TableCell>
                          <TableCell>{copy.asset}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {copy.direction === "up" ? (
                                <ArrowUp className="mr-1 h-4 w-4 text-success" />
                              ) : (
                                <ArrowDown className="mr-1 h-4 w-4 text-destructive" />
                              )}
                            </div>
                          </TableCell>
                          {!isMobile && <TableCell>{formatCurrency(copy.amount)}</TableCell>}
                          <TableCell>
                            <Badge variant={copy.result === "win" ? "success" : "destructive"}>
                              {copy.result === "win" ? "GANHO" : "PERDA"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={copy.result === "win" ? "text-success" : "text-destructive"}>
                              {copy.result === "win" ? "+" : ""}
                              {formatCurrency(copy.profit)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
