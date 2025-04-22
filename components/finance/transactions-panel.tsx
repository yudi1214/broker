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
import { CalendarIcon, Download, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TransactionsPanel() {
  const { accountType } = useAccountStore()
  const { deposits, withdrawals } = useFinanceStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("all")

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

    // Filtrar por busca
    if (searchQuery && !deposit.id.toLowerCase().includes(searchQuery.toLowerCase())) return false

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

    // Filtrar por busca
    if (searchQuery && !withdrawal.id.toLowerCase().includes(searchQuery.toLowerCase())) return false

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

  // Estatísticas
  const totalDeposits = deposits
    .filter((d) => d.accountType === accountType && d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0)

  const totalWithdrawals = withdrawals
    .filter((w) => w.accountType === accountType && w.status === "approved")
    .reduce((sum, w) => sum + w.amount, 0)

  const pendingDeposits = deposits.filter((d) => d.accountType === accountType && d.status === "pending").length

  const pendingWithdrawals = withdrawals.filter((w) => w.accountType === accountType && w.status === "pending").length

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transações</h1>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Depósitos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalDeposits)}</div>
            <p className="text-xs text-muted-foreground">{pendingDeposits} depósitos pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Saques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalWithdrawals)}</div>
            <p className="text-xs text-muted-foreground">{pendingWithdrawals} saques pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo da Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalDeposits - totalWithdrawals >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {formatCurrency(totalDeposits - totalWithdrawals)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeposits + pendingWithdrawals}</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>Visualize todas as suas transações financeiras</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="deposits">Depósitos</TabsTrigger>
              <TabsTrigger value="withdrawals">Saques</TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      type="search"
                      placeholder="ID da transação..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
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

              <TabsContent value="all" className="mt-0">
                {/* Lista de todas as transações */}
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
                              transaction.status === "approved" && "border-success bg-success/10 text-success",
                              transaction.status === "pending" && "border-warning bg-warning/10 text-warning",
                              transaction.status === "rejected" &&
                                "border-destructive bg-destructive/10 text-destructive",
                            )}
                          >
                            {transaction.status === "approved" && "Aprovado"}
                            {transaction.status === "pending" && "Pendente"}
                            {transaction.status === "rejected" && "Rejeitado"}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground text-sm">#{transaction.id.slice(0, 8)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="deposits" className="mt-0">
                {/* Lista de depósitos */}
                {filteredDeposits.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Nenhum depósito encontrado</div>
                ) : (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                      <div>Data</div>
                      <div>Tipo</div>
                      <div>Valor</div>
                      <div>Status</div>
                      <div>ID</div>
                    </div>
                    {filteredDeposits.map((deposit) => (
                      <div key={deposit.id} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0">
                        <div>{format(new Date(deposit.timestamp), "dd/MM/yyyy HH:mm")}</div>
                        <div>Depósito</div>
                        <div className="text-success">+{formatCurrency(deposit.amount)}</div>
                        <div>
                          <Badge
                            variant="outline"
                            className={cn(
                              deposit.status === "approved" && "border-success bg-success/10 text-success",
                              deposit.status === "pending" && "border-warning bg-warning/10 text-warning",
                              deposit.status === "rejected" && "border-destructive bg-destructive/10 text-destructive",
                            )}
                          >
                            {deposit.status === "approved" && "Aprovado"}
                            {deposit.status === "pending" && "Pendente"}
                            {deposit.status === "rejected" && "Rejeitado"}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground text-sm">#{deposit.id.slice(0, 8)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="withdrawals" className="mt-0">
                {/* Lista de saques */}
                {filteredWithdrawals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Nenhum saque encontrado</div>
                ) : (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                      <div>Data</div>
                      <div>Tipo</div>
                      <div>Valor</div>
                      <div>Status</div>
                      <div>ID</div>
                    </div>
                    {filteredWithdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="grid grid-cols-5 gap-4 p-4 border-b last:border-0">
                        <div>{format(new Date(withdrawal.timestamp), "dd/MM/yyyy HH:mm")}</div>
                        <div>Saque</div>
                        <div className="text-destructive">-{formatCurrency(withdrawal.amount)}</div>
                        <div>
                          <Badge
                            variant="outline"
                            className={cn(
                              withdrawal.status === "approved" && "border-success bg-success/10 text-success",
                              withdrawal.status === "pending" && "border-warning bg-warning/10 text-warning",
                              withdrawal.status === "rejected" &&
                                "border-destructive bg-destructive/10 text-destructive",
                            )}
                          >
                            {withdrawal.status === "approved" && "Aprovado"}
                            {withdrawal.status === "pending" && "Pendente"}
                            {withdrawal.status === "rejected" && "Rejeitado"}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground text-sm">#{withdrawal.id.slice(0, 8)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
