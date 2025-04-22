"use client"

import { useState } from "react"
import { useAccountStore } from "@/lib/stores/account-store"
import { useFinanceStore } from "@/lib/stores/finance-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function TransactionsTab() {
  const { accountType } = useAccountStore()
  const { deposits, withdrawals } = useFinanceStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  // Filtrar transações
  const filteredDeposits = deposits.filter((deposit) => {
    // Filtrar por tipo de conta
    if (deposit.accountType !== accountType) return false

    // Filtrar por status
    if (statusFilter !== "all" && deposit.status !== statusFilter) return false

    // Filtrar por tipo (já filtrado por ser depósito)
    if (typeFilter !== "all" && typeFilter !== "deposit") return false

    // Filtrar por data
    if (dateFrom && new Date(deposit.timestamp) < dateFrom) return false
    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setHours(23, 59, 59, 999)
      if (new Date(deposit.timestamp) > endDate) return false
    }

    return true
  })

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    // Filtrar por tipo de conta
    if (withdrawal.accountType !== accountType) return false

    // Filtrar por status
    if (statusFilter !== "all" && withdrawal.status !== statusFilter) return false

    // Filtrar por tipo (já filtrado por ser saque)
    if (typeFilter !== "all" && typeFilter !== "withdrawal") return false

    // Filtrar por data
    if (dateFrom && new Date(withdrawal.timestamp) < dateFrom) return false
    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setHours(23, 59, 59, 999)
      if (new Date(withdrawal.timestamp) > endDate) return false
    }

    return true
  })

  // Combinar e ordenar por data (mais recente primeiro)
  const allTransactions = [
    ...filteredDeposits.map((d) => ({ ...d, type: "deposit" })),
    ...filteredWithdrawals.map((w) => ({ ...w, type: "withdrawal" })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setTypeFilter("all")
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Transações</CardTitle>
        <CardDescription>Visualize todas as suas transações financeiras</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="completed">Aprovado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="deposit">Depósito</SelectItem>
                  <SelectItem value="withdrawal">Saque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus locale={ptBR} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus locale={ptBR} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>

          {/* Lista de transações */}
          <div className="space-y-4">
            {allTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Nenhuma transação encontrada</div>
            ) : (
              <div className="border rounded-md">
                <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                  <div>Data</div>
                  <div>Tipo</div>
                  <div>Valor</div>
                  <div>Status</div>
                  <div>ID</div>
                </div>
                {allTransactions.map((transaction) => (
                  <div key={transaction.id} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0">
                    <div>{format(new Date(transaction.timestamp), "dd/MM/yyyy HH:mm")}</div>
                    <div>{transaction.type === "deposit" ? "Depósito" : "Saque"}</div>
                    <div className={transaction.type === "deposit" ? "text-success" : "text-destructive"}>
                      {transaction.type === "deposit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div>
                      <Badge
                        variant="outline"
                        className={cn(
                          transaction.status === "completed" && "border-success bg-success/10 text-success",
                          transaction.status === "pending" && "border-warning bg-warning/10 text-warning",
                          transaction.status === "cancelled" && "border-destructive bg-destructive/10 text-destructive",
                        )}
                      >
                        {transaction.status === "completed" && "Aprovado"}
                        {transaction.status === "pending" && "Pendente"}
                        {transaction.status === "cancelled" && "Cancelado"}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground text-sm">#{transaction.id.slice(0, 8)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
