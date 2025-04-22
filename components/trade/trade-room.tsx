"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Search } from "lucide-react"
import { TimeSelector } from "./time-selector"
import { AmountSelector } from "./amount-selector"
import { TradeButtons } from "./trade-buttons"
import { TradingViewWidget } from "./trading-view-widget"
import { useAccountStore } from "@/lib/stores/account-store"
import { useTradeStore } from "@/lib/stores/trade-store"
import { useUserStore } from "@/lib/stores/user-store"
import { PriceVariationDisplay } from "./price-variation-display"
import { v4 as uuidv4 } from "uuid"
import { AssetService } from "@/lib/services/asset-service"
import { SkeletonLoader } from "../ui/skeleton-loader"
import { AssetTabs } from "./asset-tabs"
import { Button } from "../ui/button"
import { useRealTimePrice } from "@/hooks/use-real-time-price"
import { ActiveTradeCard } from "./active-trade-card"
import { useToast } from "@/hooks/use-toast"
import { ConfettiCelebration } from "../ui/confetti-celebration"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { AssetIcon } from "./asset-icon"
import { Check } from "lucide-react"

export function TradeRoom() {
  const { accountType } = useAccountStore()
  const { user } = useUserStore()
  const { addTrade } = useTradeStore()
  const { toast } = useToast()

  const [assets, setAssets] = useState([])
  const [openTabs, setOpenTabs] = useState<any[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState(60)
  const [selectedAmount, setSelectedAmount] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeTrade, setActiveTrade] = useState<any | null>(null)
  const [finalPrice, setFinalPrice] = useState<number | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  // Referências para evitar re-renderizações desnecessárias
  const assetsRef = useRef(assets)
  const activeTradeRef = useRef(activeTrade)

  // Obter o ativo ativo
  const activeTab = openTabs.find((tab) => tab.id === activeTabId)
  const selectedAsset = activeTab?.asset

  // Usar o hook de preço real para o ativo selecionado
  const { price: currentPrice } = useRealTimePrice(selectedAsset?.symbol || "", 1000)
  const { price } = useRealTimePrice(activeTrade?.asset || "", 1000)

  // Atualizar referências quando os valores mudarem
  useEffect(() => {
    assetsRef.current = assets
  }, [assets])

  useEffect(() => {
    activeTradeRef.current = activeTrade
  }, [activeTrade])

  // Carregar ativos apenas uma vez
  useEffect(() => {
    const loadAssets = async () => {
      if (assets.length > 0) return // Evitar carregamentos duplicados

      setIsLoading(true)
      try {
        const assetsData = await AssetService.getAllAssets()
        setAssets(assetsData)

        // Abrir a primeira aba por padrão
        if (assetsData.length > 0) {
          const firstAsset = assetsData[0]
          const tabId = uuidv4()
          setOpenTabs([{ id: tabId, asset: firstAsset }])
          setActiveTabId(tabId)
        }
      } catch (error) {
        console.error("Erro ao carregar ativos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAssets()
  }, [])

  // Atualizar preço final apenas quando necessário
  useEffect(() => {
    if (activeTrade && price !== undefined && price !== null) {
      setFinalPrice(price)
    }
  }, [price, activeTrade])

  // Memoizar funções de manipulação para evitar re-renderizações
  const handleAssetChange = useCallback(
    (asset) => {
      // Verificar se o ativo já está aberto em uma aba
      const existingTab = openTabs.find((tab) => tab.asset.id === asset.id)

      if (existingTab) {
        // Se já estiver aberto, apenas ativar a aba
        setActiveTabId(existingTab.id)
      } else {
        // Caso contrário, criar uma nova aba
        const newTabId = uuidv4()
        setOpenTabs((tabs) => [...tabs, { id: newTabId, asset }])
        setActiveTabId(newTabId)
      }

      // Fechar o popover de pesquisa
      setSearchOpen(false)
    },
    [openTabs],
  )

  const handleCloseTab = useCallback(
    (tabId) => {
      // Não permitir fechar a última aba
      if (openTabs.length <= 1) return

      setOpenTabs((tabs) => {
        const newTabs = tabs.filter((tab) => tab.id !== tabId)

        // Se a aba ativa foi fechada, ativar a primeira aba
        if (activeTabId === tabId) {
          setActiveTabId(newTabs[0].id)
        }

        return newTabs
      })
    },
    [openTabs, activeTabId],
  )

  const handleTimeSelect = useCallback((seconds) => {
    setSelectedTime(seconds)
  }, [])

  const handleAmountSelect = useCallback((amount) => {
    setSelectedAmount(amount)
  }, [])

  const handleTradeComplete = useCallback(() => {
    const currentActiveTrade = activeTradeRef.current
    if (!currentActiveTrade || finalPrice === null) return

    // Determinar o resultado com base no preço atual vs preço de entrada
    const result =
      currentActiveTrade.direction === "up"
        ? finalPrice > currentActiveTrade.entryPrice
          ? "win"
          : "loss"
        : finalPrice < currentActiveTrade.entryPrice
          ? "win"
          : "loss"

    const profit = result === "win" ? currentActiveTrade.amount * 0.85 : -currentActiveTrade.amount

    // Atualizar o trade
    const updatedTrade = {
      ...currentActiveTrade,
      result,
      profit,
      exitPrice: finalPrice,
    }

    // Adicionar o trade atualizado ao store
    addTrade(updatedTrade)

    // Se ganhou, adicionar o lucro ao saldo e mostrar celebração
    if (result === "win") {
      const balance = accountType === "demo" ? user?.demoBalance || 0 : user?.realBalance || 0
      const newBalance = balance + currentActiveTrade.amount + profit

      if (accountType === "demo") {
        useUserStore.getState().updateUserBalance("demo", newBalance)
      } else {
        useUserStore.getState().updateUserBalance("real", newBalance)
      }

      // Ativar animação de confetes
      setShowCelebration(true)

      // Mostrar notificação de vitória
      toast({
        title: "VOCÊ GANHOU! 🎉",
        description: `Lucro: ${(currentActiveTrade.amount * 0.85).toFixed(2)}!`,
        variant: "success",
      })
    } else {
      // Mostrar notificação de derrota
      toast({
        title: "Operação finalizada",
        description: `Você perdeu ${currentActiveTrade.amount.toFixed(2)}.`,
        variant: "destructive",
      })
    }

    // Limpar o trade ativo
    setActiveTrade(null)
  }, [finalPrice, accountType, user, addTrade, toast])

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false)
  }, [])

  const handleTrade = useCallback(
    async (direction) => {
      if (!selectedAsset || !currentPrice) return

      // Verificar se já existe uma operação ativa
      if (activeTrade) {
        toast({
          title: "Operação em andamento",
          description: "Aguarde a conclusão da operação atual antes de iniciar uma nova.",
          variant: "warning",
        })
        return
      }

      const newTrade = {
        id: uuidv4(),
        asset: selectedAsset.symbol,
        amount: selectedAmount,
        direction: direction,
        timeframe: `${selectedTime} segundos`,
        entryPrice: currentPrice,
        exitPrice: 0,
        result: "pending",
        profit: 0,
        timestamp: new Date().toISOString(),
        accountType: accountType,
        userId: user?.id,
        expiryTime: new Date(Date.now() + selectedTime * 1000).toISOString(),
      }

      try {
        // Verificar se o usuário tem saldo suficiente
        const balance = accountType === "demo" ? user?.demoBalance || 0 : user?.realBalance || 0
        if (balance < selectedAmount) {
          toast({
            title: "Saldo insuficiente",
            description: "Você não tem saldo suficiente para realizar esta operação.",
            variant: "destructive",
          })
          return
        }

        // Definir o trade ativo
        setActiveTrade(newTrade)

        // Atualizar o saldo do usuário
        const newBalance = balance - selectedAmount

        if (accountType === "demo") {
          useUserStore.getState().updateUserBalance("demo", newBalance)
        } else {
          useUserStore.getState().updateUserBalance("real", newBalance)
        }

        // Mostrar notificação de início de operação
        toast({
          title: "Operação iniciada",
          description: `${direction === "up" ? "Compra" : "Venda"} de ${selectedAsset.symbol} por ${selectedAmount}`,
        })
      } catch (error) {
        console.error("Erro ao criar aposta:", error)
        toast({
          title: "Erro ao iniciar operação",
          description: "Ocorreu um erro ao iniciar a operação. Tente novamente.",
          variant: "destructive",
        })
      }
    },
    [selectedAsset, currentPrice, activeTrade, selectedAmount, selectedTime, accountType, user, toast],
  )

  // Componente de pesquisa de ativos otimizado
  const AssetSearch = useCallback(() => {
    return (
      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar ativo..." />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>Nenhum ativo encontrado.</CommandEmpty>

              {assets.length > 0 && (
                <>
                  <CommandGroup heading="Criptomoedas">
                    {assets
                      .filter((asset) => asset.type === "crypto")
                      .map((asset) => (
                        <CommandItem
                          key={asset.id}
                          value={`${asset.symbol}-${asset.name}`}
                          onSelect={() => handleAssetChange(asset)}
                        >
                          <AssetIcon symbol={asset.symbol} type={asset.type} size={20} />
                          <span className="ml-2">{asset.name}</span>
                          {activeTab?.asset?.id === asset.id && <Check className="ml-auto h-4 w-4" />}
                        </CommandItem>
                      ))}
                  </CommandGroup>

                  <CommandGroup heading="Forex">
                    {assets
                      .filter((asset) => asset.type === "forex")
                      .map((asset) => (
                        <CommandItem
                          key={asset.id}
                          value={`${asset.symbol}-${asset.name}`}
                          onSelect={() => handleAssetChange(asset)}
                        >
                          <AssetIcon symbol={asset.symbol} type={asset.type} size={20} />
                          <span className="ml-2">{asset.name}</span>
                          {activeTab?.asset?.id === asset.id && <Check className="ml-auto h-4 w-4" />}
                        </CommandItem>
                      ))}
                  </CommandGroup>

                  <CommandGroup heading="Ações">
                    {assets
                      .filter((asset) => asset.type === "stock")
                      .map((asset) => (
                        <CommandItem
                          key={asset.id}
                          value={`${asset.symbol}-${asset.name}`}
                          onSelect={() => handleAssetChange(asset)}
                        >
                          <AssetIcon symbol={asset.symbol} type={asset.type} size={20} />
                          <span className="ml-2">{asset.name}</span>
                          {activeTab?.asset?.id === asset.id && <Check className="ml-auto h-4 w-4" />}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }, [searchOpen, assets, activeTab, handleAssetChange])

  if (isLoading) {
    return <SkeletonLoader type="trade" />
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-2 border-b">
        <div className="flex items-center gap-2">
          <AssetTabs
            assets={openTabs.map((tab) => tab.asset)}
            activeAsset={activeTabId || ""}
            onAssetChange={(assetId) => {
              const tab = openTabs.find((t) => t.asset.id === assetId)
              if (tab) setActiveTabId(tab.id)
            }}
            onCloseTab={(assetId) => {
              const tab = openTabs.find((t) => t.asset.id === assetId)
              if (tab) handleCloseTab(tab.id)
            }}
          />
          <AssetSearch />
        </div>

        {selectedAsset && (
          <div className="ml-auto">
            <PriceVariationDisplay symbol={selectedAsset.symbol} />
          </div>
        )}
      </div>

      <div className="flex-1 p-4 relative">
        {selectedAsset && (
          <TradingViewWidget symbol={selectedAsset.tradingViewSymbol || `BINANCE:${selectedAsset.symbol}`} />
        )}

        {/* Card de operação ativa */}
        {activeTrade && <ActiveTradeCard trade={activeTrade} onComplete={handleTradeComplete} />}

        {/* Animação de confetes */}
        <ConfettiCelebration isActive={showCelebration} onComplete={handleCelebrationComplete} />
      </div>

      <div className="p-4">
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <TimeSelector
              onSelectTime={handleTimeSelect}
              selectedTime={selectedTime}
              disabled={isLoading || !!activeTrade}
            />
            <AmountSelector
              onSelectAmount={handleAmountSelect}
              selectedAmount={selectedAmount}
              balance={accountType === "demo" ? user?.demoBalance || 0 : user?.realBalance || 0}
              disabled={isLoading || !!activeTrade}
            />
          </div>

          <TradeButtons
            onBuy={() => handleTrade("up")}
            onSell={() => handleTrade("down")}
            disabled={isLoading || !currentPrice || !!activeTrade}
          />
        </div>
      </div>
    </div>
  )
}
