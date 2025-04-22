import {
  Bitcoin,
  DollarSign,
  Euro,
  PoundSterling,
  JapaneseYenIcon as Yen,
  Apple,
  Landmark,
  Briefcase,
  BarChart3,
  CircleDollarSign,
  Gem,
  Droplet,
  Cpu,
  ShoppingCart,
  Film,
  Car,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AssetIconProps {
  symbol: string
  type: "crypto" | "forex" | "stock" | "commodity"
  size?: number
  className?: string
  color?: string
}

export function AssetIcon({ symbol, type, size = 24, className, color }: AssetIconProps) {
  // Função para determinar o ícone com base no símbolo e tipo
  const getIcon = () => {
    // Criptomoedas
    if (type === "crypto") {
      switch (symbol.toUpperCase()) {
        case "BTCUSDT":
          return <Bitcoin size={size} className={cn("text-amber-500", className)} />
        case "ETHUSDT":
          return <Gem size={size} className={cn("text-indigo-500", className)} />
        case "BNBUSDT":
          return <CircleDollarSign size={size} className={cn("text-yellow-500", className)} />
        case "ADAUSDT":
          return <CircleDollarSign size={size} className={cn("text-blue-500", className)} />
        case "SOLUSDT":
          return <CircleDollarSign size={size} className={cn("text-purple-500", className)} />
        case "XRPUSDT":
          return <CircleDollarSign size={size} className={cn("text-blue-400", className)} />
        case "DOGEUSDT":
          return <CircleDollarSign size={size} className={cn("text-yellow-400", className)} />
        default:
          return <Bitcoin size={size} className={className} />
      }
    }

    // Forex
    if (type === "forex") {
      switch (symbol.toUpperCase()) {
        case "EURUSD":
          return <Euro size={size} className={cn("text-blue-600", className)} />
        case "GBPUSD":
          return <PoundSterling size={size} className={cn("text-green-600", className)} />
        case "USDJPY":
          return <Yen size={size} className={cn("text-red-600", className)} />
        case "AUDUSD":
          return <DollarSign size={size} className={cn("text-yellow-600", className)} />
        default:
          return <DollarSign size={size} className={className} />
      }
    }

    // Ações
    if (type === "stock") {
      switch (symbol.toUpperCase()) {
        case "AAPL":
          return <Apple size={size} className={cn("text-gray-800", className)} />
        case "MSFT":
          return <Cpu size={size} className={cn("text-blue-500", className)} />
        case "GOOGL":
          return <Briefcase size={size} className={cn("text-red-500", className)} />
        case "AMZN":
          return <ShoppingCart size={size} className={cn("text-orange-500", className)} />
        case "META":
          return <Landmark size={size} className={cn("text-blue-600", className)} />
        case "TSLA":
          return <Car size={size} className={cn("text-red-600", className)} />
        case "NFLX":
          return <Film size={size} className={cn("text-red-700", className)} />
        default:
          return <BarChart3 size={size} className={className} />
      }
    }

    // Commodities
    if (type === "commodity") {
      switch (symbol.toUpperCase()) {
        case "XAUUSD": // Gold
          return <CircleDollarSign size={size} className={cn("text-yellow-500", className)} />
        case "XAGUSD": // Silver
          return <CircleDollarSign size={size} className={cn("text-gray-400", className)} />
        case "WTICOUSD": // Oil
          return <Droplet size={size} className={cn("text-black", className)} />
        default:
          return <Briefcase size={size} className={className} />
      }
    }

    // Fallback para qualquer outro caso
    return <BarChart3 size={size} className={className} />
  }

  return <div className={cn("flex items-center justify-center", className)}>{getIcon()}</div>
}
