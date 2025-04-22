"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useFinanceStore } from "@/lib/stores/finance-store"
import { useUserStore } from "@/lib/stores/user-store"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function AdminDepositsPage() {
  // Obter os depósitos do store
  const { deposits, updateDeposit } = useFinanceStore()
  const { users, updateUser } = useUserStore()

  // Filtrar apenas os depósitos pendentes
  const pendingDeposits = deposits.filter((deposit) => deposit.status === "pending")

  // Calcular o total de depósitos
  const totalDeposits = deposits.reduce((total, deposit) => {
    if (deposit.status === "approved") {
      return total + deposit.amount
    }
    return total
  }, 0)

  // Calcular o total de depósitos pendentes
  const totalPendingDeposits = pendingDeposits.reduce((total, deposit) => total + deposit.amount, 0)

  // Aprovar depósito
  const approveDeposit = (depositId: string) => {
    const deposit = deposits.find((d) => d.id === depositId)
    if (!deposit) return

    // Atualizar o status do depósito
    const updatedDeposit = {
      ...deposit,
      status: "approved",
      approvedAt: new Date().toISOString(),
    }

    updateDeposit(updatedDeposit)

    // Atualizar o saldo do usuário
    const user = users.find((u) => u.id === deposit.userId)
    if (user) {
      const newBalance = user.realBalance + deposit.amount

      const updatedUser = {
        ...user,
        realBalance: newBalance,
      }

      updateUser(updatedUser)
    }
  }

  // Rejeitar depósito
  const rejectDeposit = (depositId: string) => {
    const deposit = deposits.find((d) => d.id === depositId)
    if (!deposit) return

    // Atualizar o status do depósito
    const updatedDeposit = {
      ...deposit,
      status: "rejected",
      rejectedAt: new Date().toISOString(),
    }

    updateDeposit(updatedDeposit)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Depósitos</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Depósitos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDeposits)}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depósitos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeposits.length}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(totalPendingDeposits)} em valor total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depósitos Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deposits.filter((d) => d.status === "approved").length}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(totalDeposits)} em valor total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                deposits.length > 0 ? totalDeposits / deposits.filter((d) => d.status === "approved").length : 0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Por depósito</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Depósitos</CardTitle>
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
              {deposits.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>{deposit.id.slice(0, 8)}</TableCell>
                  <TableCell>{deposit.customerId ? `Cliente ${deposit.customerId.slice(0, 8)}` : "Usuário"}</TableCell>
                  <TableCell>{formatCurrency(deposit.amount)}</TableCell>
                  <TableCell>{deposit.method || "PIX"}</TableCell>
                  <TableCell>{formatDate(new Date(deposit.timestamp))}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        deposit.status === "pending"
                          ? "outline"
                          : deposit.status === "approved"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {deposit.status === "pending"
                        ? "Pendente"
                        : deposit.status === "approved"
                          ? "Concluído"
                          : "Rejeitado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {deposit.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => approveDeposit(deposit.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => rejectDeposit(deposit.id)}
                        >
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
