"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRealTimePrice } from "@/hooks/use-real-time-price"

interface PriceVariationDisplayProps {
  symbol: string
  className?: string
}

export function PriceVariationDisplay({ symbol, className }: PriceVariationDisplayProps) {
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | "neutral">("neutral")

  const { price, previousPrice, lastUpdate, change24h } = useRealTimePrice(symbol, 1000) // Atualizar a cada segundo

  // Determinar a direção do preço
  useEffect(() => {
    if (!price || !previousPrice) return

    if (price > previousPrice) {
      setPriceDirection("up")
    } else if (price < previousPrice) {
      setPriceDirection("down")
    } else {
      setPriceDirection("neutral")
    }

    // Reset para neutro após 1 segundo
    const timer = setTimeout(() => {
      setPriceDirection("neutral")
    }, 1000)

    return () => clearTimeout(timer)
  }, [price, previousPrice])

  if (!price) return null

  // Formatar o preço com base no tipo de ativo
  const formatPrice = () => {
    // Criptomoedas de baixo valor precisam de mais casas decimais
    if (symbol.includes("DOGE") || symbol.includes("XRP") || symbol.includes("ADA")) {
      return price.toFixed(6)
    }

    // Forex JPY tem 3 casas decimais
    if (symbol.includes("JPY")) {
      return price.toFixed(3)
    }

    // Ações e outros ativos com 2 casas decimais
    return price.toFixed(2)
  }

  return (
    <div className={cn("flex flex-col items-end", className)}>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-2xl font-bold transition-colors",
            priceDirection === "up" ? "text-green-500" : priceDirection === "down" ? "text-red-500" : "",
          )}
        >
          ${formatPrice()}
          {priceDirection !== "neutral" &&
            (priceDirection === "up" ? (
              <ArrowUp className="inline h-5 w-5 text-green-500 ml-1" />
            ) : (
              <ArrowDown className="inline h-5 w-5 text-red-500 ml-1" />
            ))}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">24h:</span>
        <span className={cn("font-medium", change24h > 0 ? "text-green-500" : change24h < 0 ? "text-red-500" : "")}>
          {change24h > 0 ? "+" : ""}
          {change24h.toFixed(2)}%
        </span>
      </div>

      {lastUpdate && (
        <div className="text-xs text-muted-foreground mt-1">Atualizado: {lastUpdate.toLocaleTimeString()}</div>
      )}
    </div>
  )
}
