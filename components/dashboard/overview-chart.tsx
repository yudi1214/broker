"use client"

import { useEffect, useState } from "react"
import { useAccountStore } from "@/lib/stores/account-store"
import { useTradeStore } from "@/lib/stores/trade-store"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function OverviewChart() {
  const { accountType } = useAccountStore()
  const { trades } = useTradeStore()
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const filteredTrades = trades.filter((trade) => trade.accountType === accountType)

    // Agrupar por dia e calcular o saldo acumulado
    const groupedByDay = filteredTrades.reduce(
      (acc, trade) => {
        const date = new Date(trade.timestamp).toLocaleDateString()

        if (!acc[date]) {
          acc[date] = {
            date,
            balance: 0,
          }
        }

        const profit = trade.result === "win" ? trade.amount * 0.85 : -trade.amount

        acc[date].balance += profit

        return acc
      },
      {} as Record<string, { date: string; balance: number }>,
    )

    // Converter para array e ordenar por data
    const chartDataArray = Object.values(groupedByDay)
    chartDataArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calcular saldo acumulado
    let cumulativeBalance = 0
    const finalChartData = chartDataArray.map((item) => {
      cumulativeBalance += item.balance
      return {
        ...item,
        balance: cumulativeBalance,
      }
    })

    // Se não houver dados, criar dados de exemplo
    if (finalChartData.length === 0) {
      const demoData = [
        { date: "01/04", balance: 10000 },
        { date: "02/04", balance: 10250 },
        { date: "03/04", balance: 10180 },
        { date: "04/04", balance: 10380 },
        { date: "05/04", balance: 10520 },
        { date: "06/04", balance: 10420 },
        { date: "07/04", balance: 10650 },
      ]
      setChartData(demoData)
    } else {
      setChartData(finalChartData)
    }
  }, [trades, accountType])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Saldo"]}
          labelFormatter={(label) => `Data: ${label}`}
        />
        <Line type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
