"use client"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Asset {
  id: string
  name: string
  symbol: string
  type: "crypto" | "forex" | "stock" | "commodity"
}

interface AssetTabsProps {
  assets: Asset[]
  activeAsset: string
  onAssetChange: (assetId: string) => void
  onCloseTab: (assetId: string) => void
}

export function AssetTabs({ assets, activeAsset, onAssetChange, onCloseTab }: AssetTabsProps) {
  if (assets.length === 0) return null

  // Função para obter o ícone baseado no tipo e símbolo do ativo
  const getAssetIcon = (asset: Asset) => {
    switch (asset.type) {
      case "crypto":
        if (asset.symbol.includes("BTC")) return <span className="text-amber-500">₿</span>
        if (asset.symbol.includes("ETH")) return <span className="text-purple-500">Ξ</span>
        if (asset.symbol.includes("ADA")) return <span className="text-blue-500">₳</span>
        if (asset.symbol.includes("XRP")) return <span className="text-blue-400">✗</span>
        if (asset.symbol.includes("SOL")) return <span className="text-green-500">◎</span>
        if (asset.symbol.includes("DOGE")) return <span className="text-yellow-500">Ð</span>
        if (asset.symbol.includes("BNB")) return <span className="text-yellow-500">🔶</span>
        return <span className="text-amber-500">₿</span>

      case "forex":
        if (asset.symbol.includes("EUR")) return <span className="text-blue-500">€</span>
        if (asset.symbol.includes("GBP")) return <span className="text-blue-600">£</span>
        if (asset.symbol.includes("JPY")) return <span className="text-red-500">¥</span>
        if (asset.symbol.includes("AUD")) return <span className="text-green-500">A$</span>
        return <span className="text-blue-500">$</span>

      case "stock":
        if (asset.symbol.includes("AAPL")) return <span className="text-gray-500">🍎</span>
        if (asset.symbol.includes("MSFT")) return <span className="text-blue-500">M</span>
        if (asset.symbol.includes("GOOGL")) return <span className="text-red-500">G</span>
        if (asset.symbol.includes("AMZN")) return <span className="text-orange-500">A</span>
        if (asset.symbol.includes("META")) return <span className="text-blue-600">f</span>
        if (asset.symbol.includes("TSLA")) return <span className="text-red-600">T</span>
        if (asset.symbol.includes("NFLX")) return <span className="text-red-600">N</span>
        return <span className="text-green-500">$</span>

      case "commodity":
        if (asset.symbol.includes("XAU")) return <span className="text-yellow-500">Au</span>
        if (asset.symbol.includes("XAG")) return <span className="text-gray-400">Ag</span>
        if (asset.symbol.includes("WTI")) return <span className="text-black">Oil</span>
        return <span className="text-yellow-500">◎</span>

      default:
        return <span>•</span>
    }
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex border-b">
        {assets.map((asset) => (
          <button
            key={asset.id}
            onClick={() => onAssetChange(asset.id)}
            className={cn(
              "inline-flex items-center justify-center px-4 py-2 text-sm font-medium border-b-2 border-transparent transition-colors",
              "hover:text-foreground/80 hover:bg-background/10",
              activeAsset === asset.id ? "border-primary text-primary" : "text-muted-foreground",
            )}
          >
            <div className="flex items-center gap-2">
              {getAssetIcon(asset)}
              <span>{asset.symbol}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onCloseTab(asset.id)
                }}
                className="ml-1 rounded-full p-1 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
