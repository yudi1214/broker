"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "./dashboard-sidebar"
import { ModeToggle } from "../mode-toggle"
import { useAccountStore } from "@/lib/stores/account-store"
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
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth-service"
import { useEffect, useState } from "react"

export function DashboardHeader() {
  const { accountType } = useAccountStore()
  const { user } = useUserStore()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Fetch current user from client-side
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user")
        if (response.ok) {
          const data = await response.json()
          setCurrentUser(data.user)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [])

  const balance = accountType === "demo" ? user?.demoBalance : user?.realBalance

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 rounded-md border bg-background px-3 py-1.5">
          <span className="text-sm font-medium">Saldo:</span>
          <span className={cn("text-sm font-bold", accountType === "demo" ? "text-warning" : "text-success")}>
            {formatCurrency(balance || 0)}
          </span>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium">
            {accountType === "demo" ? "DEMO" : "REAL"}
          </span>
        </div>

        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
        </Button>

        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={currentUser?.image || user?.image || ""}
                  alt={currentUser?.name || user?.name || ""}
                />
                <AvatarFallback>{(currentUser?.name || user?.name || "U").charAt(0)}</AvatarFallback>
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
              <Link href="/dashboard/finance">Financeiro</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

// Importação faltante
import { cn } from "@/lib/utils"
