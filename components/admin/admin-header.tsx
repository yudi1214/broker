"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Menu, Search, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebar } from "./admin-sidebar"
import { Badge } from "@/components/ui/badge"

export function AdminHeader() {
  const pathname = usePathname()

  // Função para obter o título da página com base no pathname
  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean)

    if (path.length === 1 && path[0] === "admin") {
      return "Dashboard"
    }

    if (path.length > 1) {
      const section = path[1]
      switch (section) {
        case "users":
          return "Gerenciamento de Usuários"
        case "kyc":
          return "Verificação KYC"
        case "wallet":
          return "Carteira"
        case "deposits":
          return "Depósitos"
        case "withdrawals":
          return "Saques"
        case "trades":
          return "Apostas"
        case "settings":
          return "Configurações"
        case "api":
          return "Acesso à API"
        case "webhooks":
          return "Webhooks"
        case "reports":
          return "Relatórios"
        default:
          return "Admin Panel"
      }
    }

    return "Admin Panel"
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        <div className="relative hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar..."
            className="w-64 rounded-lg bg-background pl-8 md:w-80 lg:w-96"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center">3</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Novo depósito pendente</DropdownMenuItem>
            <DropdownMenuItem>Novo saque pendente</DropdownMenuItem>
            <DropdownMenuItem>Nova verificação KYC pendente</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Sair do Admin</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
