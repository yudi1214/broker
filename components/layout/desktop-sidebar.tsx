"use client"

import Link from "next/link"
import { BarChart3, History, LineChart, LogOut, MessageCircle, User, Users, Receipt, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth-service"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DesktopSidebarProps {
  pathname: string
}

export function DesktopSidebar({ pathname }: DesktopSidebarProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const routes = [
    {
      href: "/dashboard/trade",
      icon: LineChart,
      label: "Trade",
    },
    {
      href: "/dashboard/history",
      icon: History,
      label: "Histórico",
    },
    {
      href: "/dashboard/transactions",
      icon: Receipt,
      label: "Transações",
    },
    {
      href: "/dashboard/copytrader",
      icon: Users,
      label: "Copy",
    },
    {
      href: "/dashboard/profile",
      icon: User,
      label: "Perfil",
    },
    {
      href: "/dashboard/support",
      icon: MessageCircle,
      label: "Suporte",
    },
  ]

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <TooltipProvider>
      <div className="hidden w-16 flex-col border-r bg-card/50 md:flex">
        <div className="flex h-14 items-center justify-center border-b">
          <Link href="/dashboard/trade" className="flex items-center justify-center">
            <BarChart3 className="h-5 w-5" />
          </Link>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-4 px-2">
            {routes.map((route) => {
              const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`)

              return (
                <Tooltip key={route.href} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      href={route.href}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-muted",
                        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                      )}
                    >
                      <route.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{route.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </nav>
        </div>

        <div className="border-t p-4 flex flex-col items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Alternar tema</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Sair</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
