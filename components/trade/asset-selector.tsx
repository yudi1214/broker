"use client"

import { useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Asset } from "@/lib/types/asset"
import { AssetIcon } from "./asset-icon"
import { AssetPriceList } from "./asset-price-list"

interface AssetSelectorProps {
  assets: Asset[]
  selectedAsset: Asset | null
  onAssetChange: (asset: Asset) => void
  disabled?: boolean
}

export function AssetSelector({ assets, selectedAsset, onAssetChange, disabled = false }: AssetSelectorProps) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<"search" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")

  // Agrupar ativos por tipo
  const cryptoAssets = assets.filter((asset) => asset.type === "crypto")
  const forexAssets = assets.filter((asset) => asset.type === "forex")
  const stockAssets = assets.filter((asset) => asset.type === "stock")
  const commodityAssets = assets.filter((asset) => asset.type === "commodity")

  const handleAssetSelect = (asset: Asset) => {
    onAssetChange(asset)
    setOpen(false)
  }

  return (
    <Popover open={open && !disabled} onOpenChange={(o) => !disabled && setOpen(o)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between bg-background hover:bg-muted/30 transition-colors"
          disabled={disabled}
        >
          {selectedAsset ? (
            <div className="flex items-center gap-2">
              <AssetIcon symbol={selectedAsset.symbol} type={selectedAsset.type} size={20} />
              <span className="font-medium">{selectedAsset.name}</span>
            </div>
          ) : (
            "Selecionar ativo"
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <div className="flex items-center border-b p-2">
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setView("list")}
          >
            Lista de Preços
          </Button>
          <Button
            variant={view === "search" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setView("search")}
          >
            Buscar
          </Button>
        </div>

        {view === "search" ? (
          <Command>
            <CommandInput
              placeholder="Buscar ativo..."
              icon={Search}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>Nenhum ativo encontrado.</CommandEmpty>

              {cryptoAssets.length > 0 && (
                <CommandGroup heading="Criptomoedas">
                  {cryptoAssets
                    .filter(
                      (asset) =>
                        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((asset) => (
                      <CommandItem
                        key={asset.id}
                        value={`${asset.symbol}-${asset.name}`}
                        onSelect={() => handleAssetSelect(asset)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <AssetIcon symbol={asset.symbol} type={asset.type} size={20} />
                        <span>{asset.name}</span>
                        <span className="text-xs text-muted-foreground ml-1">{asset.symbol}</span>
                        {selectedAsset?.id === asset.id && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {forexAssets.length > 0 && (
                <CommandGroup heading="Forex">
                  {forexAssets
                    .filter(
                      (asset) =>
                        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((asset) => (
                      <CommandItem
                        key={asset.id}
                        value={`${asset.symbol}-${asset.name}`}
                        onSelect={() => handleAssetSelect(asset)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <AssetIcon symbol={asset.symbol} type={asset.type} size={20} />
                        <span>{asset.name}</span>
                        <span className="text-xs text-muted-foreground ml-1">{asset.symbol}</span>
                        {selectedAsset?.id === asset.id && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {stockAssets.length > 0 && (
                <CommandGroup heading="Ações">
                  {stockAssets
                    .filter(
                      (asset) =>
                        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((asset) => (
                      <CommandItem
                        key={asset.id}
                        value={`${asset.symbol}-${asset.name}`}
                        onSelect={() => handleAssetSelect(asset)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <AssetIcon symbol={asset.symbol} type={asset.type} size={20} />
                        <span>{asset.name}</span>
                        <span className="text-xs text-muted-foreground ml-1">{asset.symbol}</span>
                        {selectedAsset?.id === asset.id && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {commodityAssets.length > 0 && (
                <CommandGroup heading="Commodities">
                  {commodityAssets
                    .filter(
                      (asset) =>
                        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((asset) => (
                      <CommandItem
                        key={asset.id}
                        value={`${asset.symbol}-${asset.name}`}
                        onSelect={() => handleAssetSelect(asset)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <AssetIcon symbol={asset.symbol} type={asset.type} size={20} />
                        <span>{asset.name}</span>
                        <span className="text-xs text-muted-foreground ml-1">{asset.symbol}</span>
                        {selectedAsset?.id === asset.id && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        ) : (
          <div className="max-h-[400px]">
            <AssetPriceList assets={assets} onSelectAsset={handleAssetSelect} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
