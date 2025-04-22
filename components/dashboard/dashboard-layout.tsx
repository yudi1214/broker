"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useAccountStore } from "@/lib/stores/account-store"
import { AppHeader } from "@/components/layout/app-header"
import { MobileNavigation } from "@/components/layout/mobile-navigation"
import { MainNavigation } from "@/components/layout/main-navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { accountType } = useAccountStore()

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader accountType={accountType} />
      <MainNavigation />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <MobileNavigation pathname={pathname} />
    </div>
  )
}
