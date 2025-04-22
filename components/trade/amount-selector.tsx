"use client"

import type React from "react"

import { useState } from "react"
import { DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface AmountSelectorProps {
  onSelectAmount: (amount: number) => void
  selectedAmount?: number // Opcional
  balance: number
  disabled?: boolean
}

export function AmountSelector({ onSelectAmount, selectedAmount = 0, balance, disabled = false }: AmountSelectorProps) {
  // Inicializar com valor padrão se selectedAmount for undefined
  const [customAmount, setCustomAmount] = useState(selectedAmount?.toString() || "0")
  const [open, setOpen] = useState(false)

  const quickAmounts = [
    { label: "R$ 10", value: 10 },
    { label: "R$ 25", value: 25 },
    { label: "R$ 50", value: 50 },
    { label: "R$ 100", value: 100 },
    { label: "R$ 250", value: 250 },
    { label: "R$ 500", value: 500 },
  ]

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value)
    }
  }

  const handleCustomAmountSubmit = () => {
    const amount = Number.parseFloat(customAmount)
    if (!isNaN(amount) && amount > 0) {
      onSelectAmount(amount)
      setOpen(false)
    }
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
  }

  return (
    <Popover open={open && !disabled} onOpenChange={(o) => !disabled && setOpen(o)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-background hover:bg-muted/30 transition-colors text-foreground"
          disabled={disabled}
        >
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-primary" />
            <span className="text-foreground font-medium">
              Valor: {selectedAmount > 0 ? formatCurrency(selectedAmount) : "Selecionar"}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="start">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amount) => (
              <Button
                key={amount.value}
                variant={selectedAmount === amount.value ? "default" : "outline"}
                className={cn(
                  "transition-all text-foreground font-medium",
                  selectedAmount === amount.value && "border-primary shadow-sm bg-primary text-primary-foreground",
                  amount.value > balance && "opacity-50 cursor-not-allowed",
                )}
                disabled={amount.value > balance}
                onClick={() => {
                  onSelectAmount(amount.value)
                  setCustomAmount(amount.value.toString())
                  setOpen(false)
                }}
              >
                {amount.label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Valor personalizado</div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                <Input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="pl-8 text-foreground"
                  placeholder="Digite o valor"
                />
              </div>
              <Button onClick={handleCustomAmountSubmit} className="shadow-sm">
                Aplicar
              </Button>
            </div>
          </div>

          <div className="text-xs text-foreground bg-muted/30 p-2 rounded-md border border-muted">
            Saldo disponível: <span className="font-medium text-primary">{formatCurrency(balance)}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
