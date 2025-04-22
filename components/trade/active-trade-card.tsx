"use client"

import { useEffect, useState, useRef, memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowDown, ArrowUp, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRealTimePrice } from "@/hooks/use-real-time-price"

interface ActiveTradeCardProps {
  trade: {
    id: string
    asset: string
    direction: "up" | "down"
    amount: number
    entryPrice: number
    timestamp: string
    expiryTime: string
  }
  onComplete?: () => void
}

// Memoizar o componente para evitar re-renderizações desnecessárias
export const ActiveTradeCard = memo(function ActiveTradeCard({ trade, onComplete }: ActiveTradeCardProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [progress, setProgress] = useState<number>(100)
  const [isCompleted, setIsCompleted] = useState(false)

  // Referências para evitar re-renderizações
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  // Atualizar referência quando a prop mudar
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Obter o preço atual do ativo
  const { price: currentPrice } = useRealTimePrice(trade.asset, 500)

  // Calcular se está no lucro ou prejuízo
  const isProfitable = trade.direction === "up" ? currentPrice > trade.entryPrice : currentPrice < trade.entryPrice

  // Calcular a diferença percentual
  const priceDiff = currentPrice ? Math.abs(((currentPrice - trade.entryPrice) / trade.entryPrice) * 100) : 0

  // Calcular o tempo total da operação
  const totalDuration = new Date(trade.expiryTime).getTime() - new Date(trade.timestamp).getTime()

  useEffect(() => {
    // Limpar timer anterior se existir
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    completedRef.current = false

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const expiryTime = new Date(trade.expiryTime).getTime()
      const startTime = new Date(trade.timestamp).getTime()

      // Tempo restante em milissegundos
      const remaining = expiryTime - now

      // Calcular o progresso (invertido: 100% -> 0%)
      const elapsed = now - startTime
      const progressValue = Math.max(0, 100 - (elapsed / totalDuration) * 100)

      setProgress(progressValue)

      if (remaining <= 0) {
        setTimeLeft(0)

        // Evitar chamadas duplicadas de onComplete
        if (!completedRef.current) {
          completedRef.current = true
          setIsCompleted(true)

          // Usar setTimeout para garantir que o estado seja atualizado antes de chamar onComplete
          setTimeout(() => {
            if (onCompleteRef.current) onCompleteRef.current()
          }, 0)
        }

        return
      }

      // Converter para segundos
      setTimeLeft(Math.ceil(remaining / 1000))
    }

    // Calcular imediatamente
    calculateTimeLeft()

    // Atualizar a cada 100ms para uma contagem regressiva suave
    timerRef.current = setInterval(calculateTimeLeft, 100)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [trade.expiryTime, trade.timestamp, totalDuration])

  // Formatar o tempo restante
  const formatTimeLeft = () => {
    if (timeLeft <= 0) return "Concluído"

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return `${minutes > 0 ? `${minutes}m ` : ""}${seconds}s`
  }

  return (
    <Card
      className={cn(
        "w-64 absolute top-4 right-4 z-10 shadow-lg border-2",
        isProfitable ? "border-green-500" : "border-red-500",
        isCompleted && "opacity-50",
      )}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 font-medium">
            <Clock className="h-4 w-4" />
            <span>{formatTimeLeft()}</span>
          </div>
          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-bold",
              isProfitable ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600",
            )}
          >
            {isProfitable ? "GANHO" : "PERDA"}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Ativo:</span>
            <span className="font-medium">{trade.asset}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Direção:</span>
            <span className="flex items-center font-medium">
              {trade.direction === "up" ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  COMPRA
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  VENDA
                </>
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Entrada:</span>
            <span className="font-medium">${trade.entryPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Atual:</span>
            <span className={cn("font-medium", isProfitable ? "text-green-500" : "text-red-500")}>
              ${currentPrice?.toFixed(2) || "..."}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Diferença:</span>
            <span className={cn("font-medium", isProfitable ? "text-green-500" : "text-red-500")}>
              {priceDiff.toFixed(4)}%
            </span>
          </div>
        </div>

        <Progress value={progress} className={cn("progress-bar h-1.5", isProfitable ? "bg-green-200" : "bg-red-200")} />
      </CardContent>
    </Card>
  )
})
