"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download } from "lucide-react"
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Bar,
  BarChart,
} from "recharts"

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [reportType, setReportType] = useState("financial")
  const [period, setPeriod] = useState("month")

  // Dados de exemplo para os gráficos
  const financialData = [
    { name: "Jan", deposits: 4000, withdrawals: 2400, profit: 1600 },
    { name: "Fev", deposits: 3000, withdrawals: 1398, profit: 1602 },
    { name: "Mar", deposits: 2000, withdrawals: 9800, profit: -7800 },
    { name: "Abr", deposits: 2780, withdrawals: 3908, profit: -1128 },
    { name: "Mai", deposits: 1890, withdrawals: 4800, profit: -2910 },
    { name: "Jun", deposits: 2390, withdrawals: 3800, profit: -1410 },
    { name: "Jul", deposits: 3490, withdrawals: 4300, profit: -810 },
  ]

  const userActivityData = [
    { name: "Jan", newUsers: 120, activeUsers: 450, inactiveUsers: 30 },
    { name: "Fev", newUsers: 132, activeUsers: 470, inactiveUsers: 35 },
    { name: "Mar", newUsers: 101, activeUsers: 510, inactiveUsers: 45 },
    { name: "Abr", newUsers: 134, activeUsers: 530, inactiveUsers: 40 },
    { name: "Mai", newUsers: 90, activeUsers: 550, inactiveUsers: 60 },
    { name: "Jun", newUsers: 230, active: 580, inactiveUsers: 70 },
    { name: "Jul", newUsers: 210, activeUsers: 600, inactiveUsers: 90 },
  ]

  const tradeData = [
    { name: "Jan", totalTrades: 1200, winningTrades: 650, losingTrades: 550 },
    { name: "Fev", totalTrades: 1300, winningTrades: 700, losingTrades: 600 },
    { name: "Mar", totalTrades: 1400, winningTrades: 750, losingTrades: 650 },
    { name: "Abr", totalTrades: 1500, winningTrades: 800, losingTrades: 700 },
    { name: "Mai", totalTrades: 1600, winningTrades: 850, losingTrades: 750 },
    { name: "Jun", totalTrades: 1700, winningTrades: 900, losingTrades: 800 },
    { name: "Jul", totalTrades: 1800, winningTrades: 950, losingTrades: 850 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="grid gap-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="financial">Financeiro</SelectItem>
              <SelectItem value="users">Usuários</SelectItem>
              <SelectItem value="trades">Apostas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Diário</SelectItem>
              <SelectItem value="week">Semanal</SelectItem>
              <SelectItem value="month">Mensal</SelectItem>
              <SelectItem value="year">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList>
          <TabsTrigger value="chart">Gráfico</TabsTrigger>
          <TabsTrigger value="table">Tabela</TabsTrigger>
          <TabsTrigger value="summary">Resumo</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {reportType === "financial"
                  ? "Relatório Financeiro"
                  : reportType === "users"
                    ? "Atividade de Usuários"
                    : "Relatório de Apostas"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportType === "financial" && (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="deposits" stroke="#8884d8" name="Depósitos" />
                    <Line type="monotone" dataKey="withdrawals" stroke="#82ca9d" name="Saques" />
                    <Line type="monotone" dataKey="profit" stroke="#ff7300" name="Lucro" />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {reportType === "users" && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newUsers" fill="#8884d8" name="Novos Usuários" />
                    <Bar dataKey="activeUsers" fill="#82ca9d" name="Usuários Ativos" />
                    <Bar dataKey="inactiveUsers" fill="#ff7300" name="Usuários Inativos" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {reportType === "trades" && (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={tradeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="totalTrades" stroke="#8884d8" name="Total de Apostas" />
                    <Line type="monotone" dataKey="winningTrades" stroke="#82ca9d" name="Apostas Ganhas" />
                    <Line type="monotone" dataKey="losingTrades" stroke="#ff7300" name="Apostas Perdidas" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {reportType === "financial"
                  ? "Relatório Financeiro"
                  : reportType === "users"
                    ? "Atividade de Usuários"
                    : "Relatório de Apostas"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Período
                      </th>
                      {reportType === "financial" && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Depósitos
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Saques
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Lucro
                          </th>
                        </>
                      )}
                      {reportType === "users" && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Novos Usuários
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Usuários Ativos
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Usuários Inativos
                          </th>
                        </>
                      )}
                      {reportType === "trades" && (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Total de Apostas
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Apostas Ganhas
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Apostas Perdidas
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {reportType === "financial" &&
                      financialData.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">R$ {item.deposits.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">R$ {item.withdrawals.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">R$ {item.profit.toFixed(2)}</td>
                        </tr>
                      ))}
                    {reportType === "users" &&
                      userActivityData.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.newUsers}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.activeUsers}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.inactiveUsers}</td>
                        </tr>
                      ))}
                    {reportType === "trades" &&
                      tradeData.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.totalTrades}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.winningTrades}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.losingTrades}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reportType === "financial" && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Depósitos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 19.550,00</div>
                    <p className="text-xs text-muted-foreground">+12% em relação ao período anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Saques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 26.406,00</div>
                    <p className="text-xs text-muted-foreground">+5% em relação ao período anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">-R$ 6.856,00</div>
                    <p className="text-xs text-muted-foreground">-8% em relação ao período anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">74%</div>
                    <p className="text-xs text-muted-foreground">+2% em relação ao período anterior</p>
                  </CardContent>
                </Card>
              </>
            )}

            {reportType === "users" && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.017</div>
                    <p className="text-xs text-muted-foreground">+15% em relação ao período anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">210</div>
                    <p className="text-xs text-muted-foreground">+8% em relação ao período anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">600</div>
                    <p className="text-xs text-muted-foreground">+5% em relação ao período anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">68%</div>
                    <p className="text-xs text-muted-foreground">+3% em relação ao período anterior</p>
                  </CardContent>
                </Card>
              </>
            )}

            {reportType === "trades" && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Apostas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">10.500</div>
                    <p className="text-xs text-muted-foreground">+18% em relação ao período anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Volume de Apostas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 525.000,00</div>
                    <p className="text-xs text-muted-foreground">+12% em relação ao período anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de Vitória</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">52%</div>
                    <p className="text-xs text-muted-foreground">-2% em relação ao período anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lucro da Plataforma</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 78.750,00</div>
                    <p className="text-xs text-muted-foreground">+8% em relação ao período anterior</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
