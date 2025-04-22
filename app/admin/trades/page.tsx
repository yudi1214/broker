import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminTradesPage() {
  // Dados de exemplo
  const trades = [
    {
      id: 1,
      user: "João Silva",
      amount: 100,
      asset: "BTC/USD",
      direction: "up",
      result: "win",
      profit: 85,
      date: "2023-05-15",
    },
    {
      id: 2,
      user: "Maria Oliveira",
      amount: 200,
      asset: "ETH/USD",
      direction: "down",
      result: "loss",
      profit: -200,
      date: "2023-05-14",
    },
    {
      id: 3,
      user: "Carlos Santos",
      amount: 50,
      asset: "BTC/USD",
      direction: "up",
      result: "win",
      profit: 42.5,
      date: "2023-05-14",
    },
    {
      id: 4,
      user: "Ana Pereira",
      amount: 150,
      asset: "ETH/USD",
      direction: "up",
      result: "loss",
      profit: -150,
      date: "2023-05-13",
    },
    {
      id: 5,
      user: "Pedro Costa",
      amount: 75,
      asset: "BTC/USD",
      direction: "down",
      result: "win",
      profit: 63.75,
      date: "2023-05-13",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Apostas</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Apostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">575</div>
            <p className="text-xs text-muted-foreground">+15% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.750</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro da Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 5.890</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Vitória</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48%</div>
            <p className="text-xs text-muted-foreground">-2% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Apostas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Direção</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Lucro/Perda</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{trade.id}</TableCell>
                  <TableCell>{trade.user}</TableCell>
                  <TableCell>R$ {trade.amount}</TableCell>
                  <TableCell>{trade.asset}</TableCell>
                  <TableCell>
                    <Badge variant={trade.direction === "up" ? "default" : "destructive"}>
                      {trade.direction === "up" ? "Alta" : "Baixa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={trade.result === "win" ? "success" : "destructive"}>
                      {trade.result === "win" ? "Ganhou" : "Perdeu"}
                    </Badge>
                  </TableCell>
                  <TableCell className={trade.profit > 0 ? "text-green-500" : "text-red-500"}>
                    {trade.profit > 0 ? `+R$ ${trade.profit}` : `-R$ ${Math.abs(trade.profit)}`}
                  </TableCell>
                  <TableCell>{trade.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
