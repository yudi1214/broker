"use client"

import Link from "next/link"
import { History, LineChart, MessageCircle, User, Users, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MobileNavigationProps {
  pathname: string
}

export function MobileNavigation({ pathname }: MobileNavigationProps) {
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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <ScrollArea orientation="horizontal" className="pb-0">
        <div className="flex items-center justify-around min-w-full">
          {routes.map((route) => {
            const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`)

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-4",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <route.icon className="h-5 w-5" />
                <span className="text-[10px]">{route.label}</span>
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
