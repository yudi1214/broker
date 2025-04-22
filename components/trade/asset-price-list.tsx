"use client"

import { memo, useState, useEffect } from "react"
import { useRealTimePrice } from "@/hooks/use-real-time-price"
import { AssetIcon } from "./asset-icon"
import { ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AssetPriceItemProps {
  asset: any
  onSelect: (asset: any) => void
}

// Componente de item de preço memoizado
const AssetPriceItem = memo(function AssetPriceItem({ asset, onSelect }: AssetPriceItemProps) {
  const { price, previousPrice, change24h } = useRealTimePrice(asset.symbol, 2000)
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | "neutral">("neutral")

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

  // Formatar o preço com base no tipo de ativo
  const formatPrice = () => {
    if (!price) return "..."

    // Criptomoedas de baixo valor precisam de mais casas decimais
    if (asset.symbol.includes("DOGE") || asset.symbol.includes("XRP") || asset.symbol.includes("ADA")) {
      return price.toFixed(6)
    }

    // Forex JPY tem 3 casas decimais
    if (asset.symbol.includes("JPY")) {
      return price.toFixed(3)
    }

    // Ações e outros ativos com 2 casas decimais
    return price.toFixed(2)
  }

  return (
    <div
      className="flex items-center justify-between p-2 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onSelect(asset)}
    >
      <div className="flex items-center gap-2">
        <AssetIcon symbol={asset.symbol} type={asset.type} size={20} />
        <div>
          <div className="font-medium text-sm">{asset.name}</div>
          <div className="text-xs text-muted-foreground">{asset.symbol}</div>
        </div>
      </div>
      <div className="text-right">
        <div
          className={cn(
            "font-medium transition-colors",
            priceDirection === "up" ? "text-green-500" : priceDirection === "down" ? "text-red-500" : "",
          )}
        >
          ${formatPrice()}
          {priceDirection !== "neutral" &&
            (priceDirection === "up" ? (
              <ArrowUp className="inline h-3 w-3 text-green-500 ml-1" />
            ) : (
              <ArrowDown className="inline h-3 w-3 text-red-500 ml-1" />
            ))}
        </div>
        <div
          className={cn(
            "text-xs",
            change24h > 0 ? "text-green-500" : change24h < 0 ? "text-red-500" : "text-muted-foreground",
          )}
        >
          {change24h > 0 ? "+" : ""}
          {change24h?.toFixed(2) || "0.00"}%
        </div>
      </div>
    </div>
  )
})

interface AssetPriceListProps {
  assets: any[]
  onSelectAsset: (asset: any) => void
}

// Componente de lista de preços memoizado
export const AssetPriceList = memo(function AssetPriceList({ assets, onSelectAsset }: AssetPriceListProps) {
  // Agrupar ativos por tipo
  const cryptoAssets = assets.filter((asset) => asset.type === "crypto")
  const forexAssets = assets.filter((asset) => asset.type === "forex")
  const stockAssets = assets.filter((asset) => asset.type === "stock")
  const commodityAssets = assets.filter((asset) => asset.type === "commodity")

  return (
    <ScrollArea className="h-[400px]">
      {cryptoAssets.length > 0 && (
        <div>
          <div className="px-3 py-2 font-semibold text-sm bg-muted/50">Criptomoedas</div>
          <div className="divide-y">
            {cryptoAssets.map((asset) => (
              <AssetPriceItem key={asset.id} asset={asset} onSelect={onSelectAsset} />
            ))}
          </div>
        </div>
      )}

      {forexAssets.length > 0 && (
        <div>
          <div className="px-3 py-2 font-semibold text-sm bg-muted/50">Forex</div>
          <div className="divide-y">
            {forexAssets.map((asset) => (
              <AssetPriceItem key={asset.id} asset={asset} onSelect={onSelectAsset} />
            ))}
          </div>
        </div>
      )}

      {stockAssets.length > 0 && (
        <div>
          <div className="px-3 py-2 font-semibold text-sm bg-muted/50">Ações</div>
          <div className="divide-y">
            {stockAssets.map((asset) => (
              <AssetPriceItem key={asset.id} asset={asset} onSelect={onSelectAsset} />
            ))}
          </div>
        </div>
      )}

      {commodityAssets.length > 0 && (
        <div>
          <div className="px-3 py-2 font-semibold text-sm bg-muted/50">Commodities</div>
          <div className="divide-y">
            {commodityAssets.map((asset) => (
              <AssetPriceItem key={asset.id} asset={asset} onSelect={onSelectAsset} />
            ))}
          </div>
        </div>
      )}
    </ScrollArea>
  )
})
