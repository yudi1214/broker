"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccountStore } from "@/lib/stores/account-store"
import { useFinanceStore } from "@/lib/stores/finance-store"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowDownToLine, ArrowUpFromLine, Download, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function TransactionsHistory() {
  const { accountType } = useAccountStore()
  const { deposits, withdrawals } = useFinanceStore()

  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Combinar depósitos e saques
  const allTransactions = [
    ...deposits.map((d) => ({ ...d, type: "deposit" })),
    ...withdrawals.map((w) => ({ ...w, type: "withdrawal" })),
  ].filter((t) => t.accountType === accountType)

  // Aplicar filtros
  let filteredTransactions = [...allTransactions]

  if (typeFilter !== "all") {
    filteredTransactions = filteredTransactions.filter((t) => t.type === typeFilter)
  }

  if (statusFilter !== "all") {
    filteredTransactions = filteredTransactions.filter((t) => t.status === statusFilter)
  }

  if (dateFilter) {
    const filterDate = new Date(dateFilter)
    filteredTransactions = filteredTransactions.filter((t) => {
      const transactionDate = new Date(t.timestamp)
      return (
        transactionDate.getFullYear() === filterDate.getFullYear() &&
        transactionDate.getMonth() === filterDate.getMonth() &&
        transactionDate.getDate() === filterDate.getDate()
      )
    })
  }

  // Ordenar por data (mais recente primeiro)
  filteredTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const resetFilters = () => {
    setTypeFilter("all")
    setStatusFilter("all")
    setDateFilter("")
  }

  // Componente de filtros para mobile
  const FilterControls = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Transação</Label>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as transações</SelectItem>
            <SelectItem value="deposit">Depósitos</SelectItem>
            <SelectItem value="withdrawal">Saques</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="approved">Aprovado</SelectItem>
            <SelectItem value="rejected">Recusado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input id="date" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1" onClick={resetFilters}>
          Limpar
        </Button>
        <Button className="flex-1">Aplicar</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Histórico de Transações</h2>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <FilterControls />
              </div>
            </SheetContent>
          </Sheet>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre suas transações por tipo, status ou data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="search" type="search" placeholder="Buscar transação..." className="pl-8" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="deposit">Depósitos</SelectItem>
                  <SelectItem value="withdrawal">Saques</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Recusado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            </div>

            <div className="flex items-end">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
          <CardDescription>{filteredTransactions.length} transações encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada com os filtros selecionados
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatDate(new Date(transaction.timestamp))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {transaction.type === "deposit" ? (
                            <ArrowDownToLine className="mr-1 h-4 w-4 text-success" />
                          ) : (
                            <ArrowUpFromLine className="mr-1 h-4 w-4 text-destructive" />
                          )}
                          {transaction.type === "deposit" ? "Depósito" : "Saque"}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "approved"
                              ? "success"
                              : transaction.status === "pending"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {transaction.status === "approved"
                            ? "Aprovado"
                            : transaction.status === "pending"
                              ? "Pendente"
                              : "Recusado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
