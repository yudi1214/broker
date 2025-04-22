import Image from "next/image"
import { cn } from "@/lib/utils"

interface AssetIconProps {
  symbol: string
  type: "crypto" | "forex" | "stock" | "commodity"
  size?: number
  className?: string
}

export function AssetIcon({ symbol, type, size = 24, className }: AssetIconProps) {
  // Mapear símbolos para caminhos de imagem
  const getImagePath = () => {
    // Caminho base para cada tipo de ativo
    const basePath = {
      crypto: "/assets/crypto/",
      forex: "/assets/forex/",
      stock: "/assets/stocks/",
      commodity: "/assets/commodities/",
    }

    // Extrair o código do ativo do símbolo
    let code = symbol.toLowerCase()

    // Para criptomoedas, remover o sufixo USDT/BTC/etc
    if (type === "crypto") {
      code = code.replace(/usdt|btc|eth|bnb|busd/i, "")
    }

    // Para forex, usar o par de moedas
    if (type === "forex") {
      code = code.toLowerCase()
    }

    return `${basePath[type]}${code}.png`
  }

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <Image
        src={getImagePath() || "/placeholder.svg"}
        alt={symbol}
        width={size}
        height={size}
        className="object-contain"
        onError={(e) => {
          // Fallback para um ícone genérico se a imagem não for encontrada
          e.currentTarget.src = `/assets/generic-${type}.png`
        }}
      />
    </div>
  )
}
