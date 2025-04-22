import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export default function AdminWithdrawalsPage() {
  // Dados de exemplo
  const withdrawals = [
    { id: 1, user: "João Silva", amount: 300, method: "PIX", status: "pending", date: "2023-05-15" },
    { id: 2, user: "Maria Oliveira", amount: 500, method: "PIX", status: "completed", date: "2023-05-14" },
    { id: 3, user: "Carlos Santos", amount: 150, method: "PIX", status: "pending", date: "2023-05-14" },
    { id: 4, user: "Ana Pereira", amount: 450, method: "PIX", status: "completed", date: "2023-05-13" },
    { id: 5, user: "Pedro Costa", amount: 200, method: "PIX", status: "pending", date: "2023-05-13" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Saques</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Saques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.600</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saques Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">R$ 650 em valor total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saques Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">R$ 950 em valor total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 320</div>
            <p className="text-xs text-muted-foreground">Por saque</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Saques</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>{withdrawal.id}</TableCell>
                  <TableCell>{withdrawal.user}</TableCell>
                  <TableCell>R$ {withdrawal.amount}</TableCell>
                  <TableCell>{withdrawal.method}</TableCell>
                  <TableCell>{withdrawal.date}</TableCell>
                  <TableCell>
                    <Badge variant={withdrawal.status === "pending" ? "outline" : "default"}>
                      {withdrawal.status === "pending" ? "Pendente" : "Concluído"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {withdrawal.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
