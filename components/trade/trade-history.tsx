"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAccountStore } from "@/lib/stores/account-store"
import { useTradeStore } from "@/lib/stores/trade-store"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowDown, ArrowUp, Download, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function TradeHistory() {
  const { accountType } = useAccountStore()
  const { trades } = useTradeStore()

  const [filteredTrades, setFilteredTrades] = useState<any[]>([])
  const [assetFilter, setAssetFilter] = useState("all")
  const [resultFilter, setResultFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  const assets = [
    { id: "all", name: "Todos os ativos" },
    { id: "BTC/USD", name: "BTC/USD" },
    { id: "ETH/USD", name: "ETH/USD" },
    { id: "EUR/USD", name: "EUR/USD" },
    { id: "Apple Inc.", name: "Apple Inc." },
    { id: "Microsoft", name: "Microsoft" },
  ]

  const results = [
    { id: "all", name: "Todos os resultados" },
    { id: "win", name: "Ganhos" },
    { id: "loss", name: "Perdas" },
  ]

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
    let filtered = trades.filter((trade) => trade.accountType === accountType)

    if (assetFilter !== "all") {
      filtered = filtered.filter((trade) => trade.asset === assetFilter)
    }

    if (resultFilter !== "all") {
      filtered = filtered.filter((trade) => trade.result === resultFilter)
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter((trade) => {
        const tradeDate = new Date(trade.timestamp)
        return (
          tradeDate.getFullYear() === filterDate.getFullYear() &&
          tradeDate.getMonth() === filterDate.getMonth() &&
          tradeDate.getDate() === filterDate.getDate()
        )
      })
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setFilteredTrades(filtered)
  }, [trades, accountType, assetFilter, resultFilter, dateFilter])

  const totalProfit = filteredTrades.reduce((sum, trade) => sum + trade.profit, 0)
  const winCount = filteredTrades.filter((trade) => trade.result === "win").length
  const lossCount = filteredTrades.filter((trade) => trade.result === "loss").length
  const winRate = filteredTrades.length > 0 ? ((winCount / filteredTrades.length) * 100).toFixed(1) : "0.0"

  const resetFilters = () => {
    setAssetFilter("all")
    setResultFilter("all")
    setDateFilter("")
  }

  // Componente de filtros para mobile
  const FilterControls = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="asset">Ativo</Label>
        <Select value={assetFilter} onValueChange={setAssetFilter}>
          <SelectTrigger id="asset">
            <SelectValue placeholder="Selecione um ativo" />
          </SelectTrigger>
          <SelectContent>
            {assets.map((asset) => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="result">Resultado</Label>
        <Select value={resultFilter} onValueChange={setResultFilter}>
          <SelectTrigger id="result">
            <SelectValue placeholder="Selecione um resultado" />
          </SelectTrigger>
          <SelectContent>
            {results.map((result) => (
              <SelectItem key={result.id} value={result.id}>
                {result.name}
              </SelectItem>
            ))}
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
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Histórico de Operações</h2>
        <div className="flex gap-2">
          {isMobile ? (
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
          ) : (
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Operações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTrades.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate}%</div>
            <p className="text-xs text-muted-foreground">
              {winCount} ganhos / {lossCount} perdas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? "text-success" : "text-destructive"}`}>
              {totalProfit >= 0 ? "+" : ""}
              {formatCurrency(totalProfit)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tipo de Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`inline-block rounded-md px-2 py-1 text-sm font-medium ${
                accountType === "demo" ? "bg-warning/20 text-warning" : "bg-success/20 text-success"
              }`}
            >
              {accountType === "demo" ? "DEMO" : "REAL"}
            </div>
          </CardContent>
        </Card>
      </div>

      {!isMobile && (
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtre suas operações por ativo, resultado ou data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="search" type="search" placeholder="Buscar por ativo..." className="pl-8" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="asset">Ativo</Label>
                <Select value={assetFilter} onValueChange={setAssetFilter}>
                  <SelectTrigger id="asset">
                    <SelectValue placeholder="Selecione um ativo" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="result">Resultado</Label>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger id="result">
                    <SelectValue placeholder="Selecione um resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    {results.map((result) => (
                      <SelectItem key={result.id} value={result.id}>
                        {result.name}
                      </SelectItem>
                    ))}
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>Operações</CardTitle>
          <CardDescription>{filteredTrades.length} operações encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTrades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma operação encontrada com os filtros selecionados
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Direção</TableHead>
                    {!isMobile && <TableHead>Tempo</TableHead>}
                    <TableHead>Valor</TableHead>
                    <TableHead>Resultado</TableHead>
                    {!isMobile && <TableHead className="text-right">Retorno</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatDate(new Date(trade.timestamp))}
                      </TableCell>
                      <TableCell>{trade.asset}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {trade.direction === "up" ? (
                            <ArrowUp className="mr-1 h-4 w-4 text-success" />
                          ) : (
                            <ArrowDown className="mr-1 h-4 w-4 text-destructive" />
                          )}
                          {!isMobile && (trade.direction === "up" ? "Subir" : "Descer")}
                        </div>
                      </TableCell>
                      {!isMobile && <TableCell>{trade.timeframe}</TableCell>}
                      <TableCell>{formatCurrency(trade.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={trade.result === "win" ? "success" : "destructive"}>
                          {trade.result === "win" ? "GANHO" : "PERDA"}
                        </Badge>
                      </TableCell>
                      {!isMobile && (
                        <TableCell className="text-right">
                          <span className={trade.result === "win" ? "text-success" : "text-destructive"}>
                            {trade.result === "win" ? "+" : ""}
                            {formatCurrency(trade.profit)}
                          </span>
                        </TableCell>
                      )}
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
