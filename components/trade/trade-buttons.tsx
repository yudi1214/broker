"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TradeButtonsProps {
  onBuy: () => void
  onSell: () => void
  disabled?: boolean
  className?: string
}

export function TradeButtons({ onBuy, onSell, disabled = false, className }: TradeButtonsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <Button
        className="h-14 bg-green-600 text-white text-lg font-bold flex items-center justify-center transition-all hover:translate-y-[-2px] shadow-lg hover:bg-green-700"
        onClick={onBuy}
        disabled={disabled}
      >
        <ArrowUp className="mr-2 h-5 w-5" />
        <span className="text-white">COMPRAR</span>
      </Button>
      <Button
        className="h-14 bg-red-600 text-white text-lg font-bold flex items-center justify-center transition-all hover:translate-y-[-2px] shadow-lg hover:bg-red-700"
        onClick={onSell}
        disabled={disabled}
      >
        <ArrowDown className="mr-2 h-5 w-5" />
        <span className="text-white">VENDER</span>
      </Button>
    </div>
  )
}
