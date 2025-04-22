"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Users,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  Settings,
  Key,
  Webhook,
  FileText,
  ShieldCheck,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const menuItems = [
    {
      title: "Principal",
      items: [
        {
          title: "Dashboard",
          icon: BarChart3,
          href: "/admin",
          active: pathname === "/admin",
        },
      ],
    },
    {
      title: "Usuários",
      items: [
        {
          title: "Gerenciar Usuários",
          icon: Users,
          href: "/admin/users",
          active: pathname === "/admin/users",
        },
        {
          title: "KYC Usuários",
          icon: ShieldCheck,
          href: "/admin/kyc",
          active: pathname === "/admin/kyc",
        },
      ],
    },
    {
      title: "Finanças",
      items: [
        {
          title: "Carteira",
          icon: Wallet,
          href: "/admin/wallet",
          active: pathname === "/admin/wallet",
        },
        {
          title: "Depósitos",
          icon: ArrowDownToLine,
          href: "/admin/deposits",
          active: pathname === "/admin/deposits",
        },
        {
          title: "Saques",
          icon: ArrowUpFromLine,
          href: "/admin/withdrawals",
          active: pathname === "/admin/withdrawals",
        },
        {
          title: "Operações",
          icon: DollarSign,
          href: "/admin/trades",
          active: pathname === "/admin/trades",
        },
      ],
    },
    {
      title: "Sistema",
      items: [
        {
          title: "Configurações",
          icon: Settings,
          href: "/admin/settings",
          active: pathname === "/admin/settings",
        },
        {
          title: "Acesso à API",
          icon: Key,
          href: "/admin/api",
          active: pathname === "/admin/api",
        },
        {
          title: "Webhooks",
          icon: Webhook,
          href: "/admin/webhooks",
          active: pathname === "/admin/webhooks",
        },
        {
          title: "Relatórios",
          icon: FileText,
          href: "/admin/reports",
          active: pathname === "/admin/reports",
        },
      ],
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-background border-r flex flex-col h-full fixed top-0 left-0 z-20",
          isSidebarOpen ? "w-64" : "w-20",
        )}
      >
        {/* Header */}
        <div className="h-16 border-b flex items-center px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <DollarSign className="h-4 w-4" />
            </div>
            {isSidebarOpen && <span className="text-lg font-bold">TradeX Admin</span>}
          </div>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <div className="py-4">
            {menuItems.map((section) => (
              <div key={section.title} className="mb-4">
                {isSidebarOpen && (
                  <div className="px-4 mb-2">
                    <h3 className="text-xs font-semibold text-muted-foreground">{section.title}</h3>
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-2 text-sm font-medium",
                        item.active
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        !isSidebarOpen && "justify-center",
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", isSidebarOpen && "mr-3")} />
                      {isSidebarOpen && <span>{item.title}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4">
          <div className={cn("flex items-center", isSidebarOpen ? "justify-between" : "justify-center")}>
            {isSidebarOpen && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Admin</span>
                  <span className="text-xs text-muted-foreground">admin@tradex.com</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              {isSidebarOpen && <ModeToggle />}
              <Button variant="ghost" size="icon" onClick={() => router.push("/api/auth/logout")}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn("flex-1 overflow-auto md:ml-64")}>
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <h1 className="text-xl font-semibold">
              {menuItems.flatMap((section) => section.items).find((item) => item.active)?.title || "Dashboard"}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-4">{!isSidebarOpen && <ModeToggle />}</div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
