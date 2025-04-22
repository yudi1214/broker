"use client"

import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Trade {
  id: string
  asset: string
  amount: number
  direction: "up" | "down"
  timeframe: string
  entryPrice: number
  exitPrice: number
  result: "win" | "loss"
  profit: number
  timestamp: string
  accountType: "demo" | "real"
}

interface RecentTradesTableProps {
  trades: Trade[]
}

export function RecentTradesTable({ trades }: RecentTradesTableProps) {
  if (trades.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">Nenhuma operação realizada ainda</div>
  }

  return (
    <div className="space-y-2">
      {trades.map((trade) => (
        <div key={trade.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-full ${trade.direction === "up" ? "bg-success/20" : "bg-destructive/20"}`}>
              {trade.direction === "up" ? (
                <ArrowUp className={`h-3 w-3 text-success`} />
              ) : (
                <ArrowDown className={`h-3 w-3 text-destructive`} />
              )}
            </div>
            <div>
              <div className="font-medium text-sm">{trade.asset}</div>
              <div className="text-xs text-muted-foreground">{formatDate(new Date(trade.timestamp))}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-medium text-sm ${trade.result === "win" ? "text-success" : "text-destructive"}`}>
              {trade.result === "win" ? "+" : ""}
              {formatCurrency(trade.profit)}
            </div>
            <Badge variant={trade.result === "win" ? "success" : "destructive"} className="text-[10px]">
              {trade.result === "win" ? "GANHO" : "PERDA"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
