import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminChart } from "@/components/admin/admin-chart"
import { AdminStats } from "@/components/admin/admin-stats"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react"

export default function AdminDashboard() {
  // Dados de exemplo para atividades recentes
  const recentActivities = [
    {
      id: 1,
      type: "deposit",
      user: "João Silva",
      amount: 5000,
      timestamp: "15 minutos atrás",
      avatar: "JS",
    },
    {
      id: 2,
      type: "withdrawal",
      user: "Maria Oliveira",
      amount: 12000,
      timestamp: "30 minutos atrás",
      avatar: "MO",
    },
    {
      id: 3,
      type: "trade",
      user: "Carlos Santos",
      amount: 2500,
      asset: "BTC/USD",
      direction: "up",
      result: "win",
      timestamp: "45 minutos atrás",
      avatar: "CS",
    },
    {
      id: 4,
      type: "kyc",
      user: "Ana Pereira",
      status: "pending",
      timestamp: "1 hora atrás",
      avatar: "AP",
    },
    {
      id: 5,
      type: "registration",
      user: "Pedro Costa",
      timestamp: "2 horas atrás",
      avatar: "PC",
    },
    {
      id: 6,
      type: "trade",
      user: "Luciana Mendes",
      amount: 3800,
      asset: "ETH/USD",
      direction: "down",
      result: "loss",
      timestamp: "2 horas atrás",
      avatar: "LM",
    },
    {
      id: 7,
      type: "deposit",
      user: "Roberto Alves",
      amount: 8500,
      timestamp: "3 horas atrás",
      avatar: "RA",
    },
    {
      id: 8,
      type: "kyc",
      user: "Fernanda Lima",
      status: "approved",
      timestamp: "4 horas atrás",
      avatar: "FL",
    },
  ]

  // Dados de exemplo para os melhores ativos
  const topAssets = [
    { asset: "BTC/USD", winRate: 68.5, trend: "up" },
    { asset: "ETH/USD", winRate: 62.3, trend: "up" },
    { asset: "EUR/USD", winRate: 58.7, trend: "up" },
    { asset: "AAPL", winRate: 61.8, trend: "up" },
    { asset: "GOLD", winRate: 52.1, trend: "down" },
  ]

  // Dados de exemplo para resultados diários
  const dailyResults = [
    { period: "Hoje", wins: 1245, losses: 876, profit: 68500 },
    { period: "Esta semana", wins: 5872, losses: 3921, profit: 285000 },
    { period: "Este mês", wins: 24350, losses: 16780, profit: 1250000 },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard Administrativo</h1>

      <AdminStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>Desempenho da plataforma nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AdminChart />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas atividades na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead>Quando</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder-text.png?text=${activity.avatar}`} alt={activity.user} />
                          <AvatarFallback>{activity.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{activity.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          activity.type === "deposit"
                            ? "default"
                            : activity.type === "withdrawal"
                              ? "secondary"
                              : activity.type === "trade"
                                ? activity.result === "win"
                                  ? "success"
                                  : "destructive"
                                : "outline"
                        }
                      >
                        {activity.type === "deposit"
                          ? "Depósito"
                          : activity.type === "withdrawal"
                            ? "Saque"
                            : activity.type === "trade"
                              ? "Operação"
                              : activity.type === "kyc"
                                ? "KYC"
                                : "Registro"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {activity.type === "deposit" || activity.type === "withdrawal"
                        ? `R$ ${activity.amount.toLocaleString()}`
                        : activity.type === "trade"
                          ? `${activity.asset} ${activity.direction === "up" ? "↑" : "↓"} R$ ${activity.amount.toLocaleString()}`
                          : activity.type === "kyc"
                            ? activity.status === "pending"
                              ? "Pendente"
                              : activity.status === "approved"
                                ? "Aprovado"
                                : "Rejeitado"
                            : "Novo usuário"}
                    </TableCell>
                    <TableCell>{activity.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Melhores Ativos</CardTitle>
            <CardDescription>Ativos com maior taxa de acerto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAssets.map((asset) => (
                <div key={asset.asset} className="flex items-center">
                  <div className="w-full flex items-center">
                    <span className="font-medium">{asset.asset}</span>
                    <div className="ml-auto flex items-center">
                      {asset.trend === "up" ? (
                        <TrendingUp className="mr-1 h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="mr-1 h-4 w-4 text-destructive" />
                      )}
                      <span className={asset.trend === "up" ? "text-success" : "text-destructive"}>
                        {asset.winRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Histórico de Resultados</CardTitle>
            <CardDescription>Desempenho da plataforma por período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyResults.map((result) => (
                <div key={result.period} className="flex items-center">
                  <div className="w-full flex items-center">
                    <span className="font-medium">{result.period}</span>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4 text-success" />
                        <span>{result.wins.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <ArrowDown className="mr-1 h-4 w-4 text-destructive" />
                        <span>{result.losses.toLocaleString()}</span>
                      </div>
                      <span className="font-medium text-success">R$ {result.profit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
