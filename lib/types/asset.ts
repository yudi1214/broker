export interface Asset {
  id: string
  symbol: string
  name: string
  type: "crypto" | "forex" | "stock" | "commodity"
  price: number
  change24h?: number
  volume24h?: number
  marketCap?: number
  tradingViewSymbol?: string // Símbolo específico para o TradingView
  isActive: boolean
}

export interface AssetPrice {
  symbol: string
  price: number
  change24h?: number
  timestamp: number
}
