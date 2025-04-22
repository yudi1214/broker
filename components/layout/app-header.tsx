"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useUserStore } from "@/lib/stores/user-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth-service"
import { useAccountStore } from "@/lib/stores/account-store"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { NotificationPanel } from "@/components/notifications/notification-panel"

interface AppHeaderProps {
  accountType: "demo" | "real"
}

export function AppHeader({ accountType }: AppHeaderProps) {
  const { user } = useUserStore()
  const router = useRouter()
  const { toggleAccountType } = useAccountStore()
  const balance = accountType === "demo" ? user?.demoBalance : user?.realBalance

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  const handleDeposit = () => {
    router.push("/dashboard/profile?section=deposit")
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <div className="flex items-center gap-2 font-bold">
        <Link href="/dashboard/trade">BinaryTrade</Link>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {accountType === "real" && (
          <Button
            onClick={handleDeposit}
            className="bg-green-600 hover:bg-green-700 text-white border border-green-500 shadow-sm flex items-center gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">Depositar</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-2 font-medium",
                accountType === "demo" ? "border-warning/50 text-warning" : "border-success/50 text-success",
              )}
            >
              <span className="font-bold">{formatCurrency(balance || 0)}</span>
              <span
                className={cn(
                  "rounded-sm px-1 py-0.5 text-[10px] font-medium",
                  accountType === "demo" ? "bg-warning/20" : "bg-success/20",
                )}
              >
                {accountType === "demo" ? "DEMO" : "REAL"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Alternar Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleAccountType}>
              {accountType === "demo" ? "Mudar para Conta Real" : "Mudar para Conta Demo"}
            </DropdownMenuItem>
            {accountType === "real" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDeposit} className="text-green-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Fazer Depósito
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <NotificationPanel />

        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                <AvatarFallback>{(user?.name || "U").charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile?section=deposit" className="text-green-600 font-medium">
                Depositar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile?section=withdraw">Sacar</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
