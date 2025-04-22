"use client"

import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAccountStore } from "@/lib/stores/account-store"

interface HeaderProps {
  accountType: "demo" | "real"
}

export function Header({ accountType }: HeaderProps) {
  const { toggleAccountType, balance } = useAccountStore()

  return (
    <header className="bg-background border-b py-2 px-4 flex items-center justify-between">
      <div className="md:ml-64 flex items-center">
        <h1 className="text-xl font-bold md:hidden">BinaryOptions</h1>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <span className={accountType === "demo" ? "text-yellow-500" : "text-green-500"}>
                {accountType === "demo" ? "Demo" : "Real"}: ${balance.toFixed(2)}
              </span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleAccountType()}>
              Alternar para {accountType === "demo" ? "Real" : "Demo"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
