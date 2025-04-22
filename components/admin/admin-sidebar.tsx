"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Users,
  FileCheck,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Settings,
  Webhook,
  FileCode,
  BarChart,
  LogOut,
} from "lucide-react"

interface AdminSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Usuários",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
    {
      label: "Verificação KYC",
      icon: FileCheck,
      href: "/admin/kyc",
      active: pathname === "/admin/kyc",
    },
    {
      label: "Carteira",
      icon: Wallet,
      href: "/admin/wallet",
      active: pathname === "/admin/wallet",
    },
    {
      label: "Depósitos",
      icon: ArrowDownToLine,
      href: "/admin/deposits",
      active: pathname === "/admin/deposits",
    },
    {
      label: "Saques",
      icon: ArrowUpFromLine,
      href: "/admin/withdrawals",
      active: pathname === "/admin/withdrawals",
    },
    {
      label: "Apostas",
      icon: TrendingUp,
      href: "/admin/trades",
      active: pathname === "/admin/trades",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
    {
      label: "API",
      icon: FileCode,
      href: "/admin/api",
      active: pathname === "/admin/api",
    },
    {
      label: "Webhooks",
      icon: Webhook,
      href: "/admin/webhooks",
      active: pathname === "/admin/webhooks",
    },
    {
      label: "Relatórios",
      icon: BarChart,
      href: "/admin/reports",
      active: pathname === "/admin/reports",
    },
  ]

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Admin Panel</h2>
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="space-y-1">
                {routes.map((route) => (
                  <Link key={route.href} href={route.href}>
                    <Button variant={route.active ? "secondary" : "ghost"} size="sm" className="w-full justify-start">
                      <route.icon className="mr-2 h-4 w-4" />
                      {route.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 absolute bottom-4 w-full">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Sair do Admin
          </Button>
        </Link>
      </div>
    </div>
  )
}
