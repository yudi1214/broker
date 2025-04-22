import type { Statistics } from "../models/types"

// Serviço para obter estatísticas da plataforma
export const StatisticsService = {
  // Obter estatísticas gerais
  getStatistics: async (): Promise<Statistics> => {
    // Dados simulados com valores mais realistas
    const totalUsers = Math.floor(Math.random() * 5000) + 5000 // Entre 5000 e 10000
    const activeUsers = Math.floor(totalUsers * 0.7) // 70% de usuários ativos
    const totalDeposits = Math.floor(Math.random() * 5000000) + 5000000 // Entre 5M e 10M
    const totalWithdrawals = Math.floor(Math.random() * 3000000) + 2000000 // Entre 2M e 5M
    const totalTrades = Math.floor(Math.random() * 100000) + 100000 // Entre 100k e 200k
    const platformProfit = Math.floor(Math.random() * 1000000) + 500000 // Entre 500k e 1.5M
    const winRate = Math.random() * 20 + 40 // Entre 40% e 60%
    const dailyActiveUsers = Math.floor(totalUsers * 0.2) // 20% de usuários ativos diariamente

    return {
      totalUsers,
      activeUsers,
      totalDeposits,
      totalWithdrawals,
      totalTrades,
      platformProfit,
      winRate,
      dailyActiveUsers,
    }
  },

  // Obter dados para o gráfico do dashboard
  getDashboardChartData: async (): Promise<any[]> => {
    // Simulação de dados para o gráfico com valores mais realistas
    const today = new Date()
    const data = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)

      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")

      // Gerar valores aleatórios mais realistas
      const dailyProfit = Math.floor(Math.random() * 20000) + 30000 // Entre 30k e 50k
      const dailyUsers = Math.floor(Math.random() * 200) + 500 // Entre 500 e 700
      const dailyTrades = Math.floor(Math.random() * 1000) + 1000 // Entre 1000 e 2000

      data.push({
        date: `${day}/${month}`,
        profit: dailyProfit,
        users: dailyUsers,
        trades: dailyTrades,
      })
    }

    return data
  },

  // Obter dados de usuários ativos por hora
  getActiveUsersByHour: async (): Promise<any[]> => {
    const data = []

    for (let hour = 0; hour < 24; hour++) {
      // Mais usuários durante o horário comercial
      let baseUsers = 100
      if (hour >= 9 && hour <= 18) {
        baseUsers = 300
      } else if ((hour >= 19 && hour <= 23) || (hour >= 0 && hour <= 2)) {
        baseUsers = 150
      }

      data.push({
        hour: `${hour}:00`,
        users: Math.floor(Math.random() * 50) + baseUsers,
      })
    }

    return data
  },

  // Obter dados de desempenho por ativo
  getAssetPerformance: async (): Promise<any[]> => {
    return [
      { asset: "BTC/USD", winRate: 68.5, volume: 125000 },
      { asset: "ETH/USD", winRate: 62.3, volume: 98000 },
      { asset: "EUR/USD", winRate: 58.7, volume: 85000 },
      { asset: "GBP/USD", winRate: 55.2, volume: 72000 },
      { asset: "AAPL", winRate: 61.8, volume: 68000 },
      { asset: "TSLA", winRate: 59.4, volume: 65000 },
      { asset: "GOLD", winRate: 52.1, volume: 58000 },
      { asset: "OIL", winRate: 49.8, volume: 52000 },
    ]
  },

  // Obter dados de depósitos e saques por dia
  getFinancialFlowByDay: async (): Promise<any[]> => {
    const today = new Date()
    const data = []

    for (let i = 14; i >= 0; i--) {
      const date = new Date()
      date.setDate(today.getDate() - i)

      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")

      // Gerar valores aleatórios para depósitos e saques
      const deposits = Math.floor(Math.random() * 30000) + 70000
      const withdrawals = Math.floor(Math.random() * 20000) + 40000

      data.push({
        date: `${day}/${month}`,
        deposits,
        withdrawals,
      })
    }

    return data
  },
}
