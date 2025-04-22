"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNavigation() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard/trade",
      label: "Trade",
    },
    {
      href: "/dashboard/finance?tab=deposit",
      label: "Depósito",
    },
    {
      href: "/dashboard/finance?tab=withdraw",
      label: "Retirada",
    },
    {
      href: "/dashboard/finance?tab=transactions",
      label: "Transações",
    },
    {
      href: "/dashboard/history",
      label: "Operações",
    },
    {
      href: "/dashboard/profile",
      label: "Perfil",
    },
    {
      href: "/dashboard/tournament",
      label: "Torneio",
    },
    {
      href: "/dashboard/copytrader",
      label: "Copy",
    },
  ]

  return (
    <nav className="hidden md:flex items-center space-x-1 border-b">
      {routes.map((route) => {
        const isActive =
          pathname === route.href ||
          (pathname.includes(route.href) && route.href !== "/dashboard/trade") ||
          (pathname.includes("finance") && route.href.includes("finance"))

        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors",
              isActive ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}
