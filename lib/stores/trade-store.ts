import { create } from "zustand"
import { persist } from "zustand/middleware"

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

interface TradeState {
  trades: Trade[]
  addTrade: (trade: Trade) => void
  deleteTrade: (tradeId: string) => void
}

export const useTradeStore = create<TradeState>()(
  persist(
    (set) => ({
      trades: [
        {
          id: "1",
          asset: "BTC/USD",
          amount: 100,
          direction: "up",
          timeframe: "5 minutos",
          entryPrice: 65000,
          exitPrice: 65500,
          result: "win",
          profit: 85,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          accountType: "demo",
        },
        {
          id: "2",
          asset: "ETH/USD",
          amount: 200,
          direction: "down",
          timeframe: "15 minutos",
          entryPrice: 3500,
          exitPrice: 3400,
          result: "win",
          profit: 170,
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          accountType: "demo",
        },
        {
          id: "3",
          asset: "EUR/USD",
          amount: 150,
          direction: "up",
          timeframe: "1 minuto",
          entryPrice: 1.08,
          exitPrice: 1.075,
          result: "loss",
          profit: -150,
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          accountType: "demo",
        },
      ],
      addTrade: (trade) => set((state) => ({ trades: [trade, ...state.trades] })),
      deleteTrade: (tradeId) => set((state) => ({ trades: state.trades.filter((trade) => trade.id !== tradeId) })),
    }),
    {
      name: "trade-storage",
    },
  ),
)
