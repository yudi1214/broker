"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LineChart, Wallet, History, Users, HelpCircle, LogOut, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogoutButton } from "@/components/auth/logout-button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function DashboardSidebar({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      title: "Traderoom",
      icon: <LineChart className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/finance",
      title: "Finanças",
      icon: <Wallet className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/transactions",
      title: "Transações",
      icon: <History className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/kyc",
      title: "Verificação KYC",
      icon: <ShieldCheck className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/profile",
      title: "Perfil",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/dashboard/support",
      title: "Suporte",
      icon: <HelpCircle className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Dashboard</h2>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="space-y-1">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={pathname === route.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={route.href}>
                    {route.icon}
                    {route.title}
                  </Link>
                </Button>
              ))}
              <LogoutButton>
                <Button variant="ghost" className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </LogoutButton>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
