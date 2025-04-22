"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatisticsService } from "@/lib/services/statistics-service"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function AdminChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("profit")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true)
        const data = await StatisticsService.getDashboardChartData()
        setChartData(data)
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [])

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return (
    <Tabs defaultValue="profit" className="w-full" onValueChange={setActiveTab}>
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="profit">Lucro</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="trades">Operações</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="profit" className="mt-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value / 1000}k`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Lucro"]}
              labelFormatter={(label) => `Data: ${label}`}
              contentStyle={{ background: "var(--background)", borderColor: "var(--border)" }}
            />
            <Bar dataKey="profit" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="users" className="mt-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString()} usuários`, "Ativos"]}
              labelFormatter={(label) => `Data: ${label}`}
              contentStyle={{ background: "var(--background)", borderColor: "var(--border)" }}
            />
            <Line type="monotone" dataKey="users" stroke="var(--primary)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="trades" className="mt-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString()} operações`, "Total"]}
              labelFormatter={(label) => `Data: ${label}`}
              contentStyle={{ background: "var(--background)", borderColor: "var(--border)" }}
            />
            <Bar dataKey="trades" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}
