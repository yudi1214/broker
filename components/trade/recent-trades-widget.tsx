"use client"

import { useState, useEffect } from "react"
import { useTradeStore } from "@/lib/stores/trade-store"
import { useAccountStore } from "@/lib/stores/account-store"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowDown, ArrowUp, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface RecentTradesWidgetProps {
  limit?: number
  className?: string
}

export function RecentTradesWidget({ limit = 5, className }: RecentTradesWidgetProps) {
  const { trades } = useTradeStore()
  const { accountType } = useAccountStore()
  const [recentTrades, setRecentTrades] = useState<any[]>([])

  useEffect(() => {
    // Filtrar trades pelo tipo de conta e ordenar por data (mais recente primeiro)
    const filteredTrades = trades
      .filter((trade) => trade.accountType === accountType)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    setRecentTrades(filteredTrades)
  }, [trades, accountType, limit])

  if (recentTrades.length === 0) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground text-sm", className)}>
        Nenhuma operação realizada ainda
      </div>
    )
  }

  return (
    <div className={cn("border rounded-md", className)}>
      <div className="p-3 border-b">
        <h3 className="font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Operações Recentes
        </h3>
      </div>

      <ScrollArea className="h-[250px]">
        <div className="divide-y">
          {recentTrades.map((trade) => (
            <div key={trade.id} className="p-3 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className={cn("p-1 rounded-full", trade.direction === "up" ? "bg-green-500/20" : "bg-red-500/20")}
                  >
                    {trade.direction === "up" ? (
                      <ArrowUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                  <span className="font-medium">{trade.asset}</span>
                </div>
                <Badge variant={trade.result === "win" ? "success" : "destructive"} className="text-[10px]">
                  {trade.result === "win" ? "GANHO" : "PERDA"}
                </Badge>
              </div>

              <div className="flex justify-between text-sm">
                <div className="text-muted-foreground">{formatDate(new Date(trade.timestamp))}</div>
                <div className={cn("font-medium", trade.result === "win" ? "text-green-500" : "text-red-500")}>
                  {trade.result === "win" ? "+" : ""}
                  {formatCurrency(trade.profit)}
                </div>
              </div>

              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <div>Entrada: {trade.entryPrice}</div>
                <div>Saída: {trade.exitPrice}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
