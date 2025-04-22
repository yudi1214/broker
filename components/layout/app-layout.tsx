"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAccountStore } from "@/lib/stores/account-store"
import { AppHeader } from "./app-header"
import { DesktopSidebar } from "./desktop-sidebar"
import { MobileNavigation } from "./mobile-navigation"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const { accountType } = useAccountStore()
  const [isMobile, setIsMobile] = useState(false)

  // Detectar se é mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader accountType={accountType} />

      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DesktopSidebar pathname={pathname} />}

        <main className={cn("flex-1 overflow-y-auto", isMobile ? "pb-16" : "pb-0")}>{children}</main>
      </div>

      {isMobile && <MobileNavigation pathname={pathname} />}
    </div>
  )
}
