"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAccountStore } from "@/lib/stores/account-store"
import { Badge } from "@/components/ui/badge"

export function AccountSwitcher() {
  const [open, setOpen] = useState(false)
  const { accountType, setAccountType, demoBalance, realBalance } = useAccountStore()

  const accounts = [
    {
      label: "Conta Demo",
      value: "demo",
      balance: demoBalance,
      color: "bg-blue-500",
    },
    {
      label: "Conta Real",
      value: "real",
      balance: realBalance,
      color: "bg-green-500",
    },
  ]

  const currentAccount = accounts.find((account) => account.value === accountType)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between md:w-[200px] border-none bg-background/10 hover:bg-background/20 text-white"
        >
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-xs opacity-70">{currentAccount?.label}</span>
              <span className="font-bold">
                R$ {currentAccount?.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar conta..." />
          <CommandList>
            <CommandEmpty>Nenhuma conta encontrada.</CommandEmpty>
            <CommandGroup>
              {accounts.map((account) => (
                <CommandItem
                  key={account.value}
                  value={account.value}
                  onSelect={(currentValue) => {
                    setAccountType(currentValue as "demo" | "real")
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", accountType === account.value ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("h-2 w-2 rounded-full p-0", account.color)} />
                      {account.label}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      R$ {account.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
