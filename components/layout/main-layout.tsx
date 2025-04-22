"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAccountStore } from "@/lib/stores/account-store"
import { cn } from "@/lib/utils"
import { DesktopSidebar } from "./desktop-sidebar"
import { MobileNavigation } from "./mobile-navigation"
import { AppHeader } from "./app-header"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { accountType } = useAccountStore()
  const [isMobile, setIsMobile] = useState(false)

  // Redirecionar para trade se estiver na página dashboard
  useEffect(() => {
    if (pathname === "/dashboard") {
      router.push("/dashboard/trade")
    }
  }, [pathname, router])

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
    <div className={cn("flex min-h-screen flex-col bg-background")}>
      <AppHeader accountType={accountType} />

      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <DesktopSidebar pathname={pathname} />}

        <main className={cn("flex-1 overflow-y-auto", isMobile ? "pb-16" : "pb-0")}>
          <div className="h-full">{children}</div>
        </main>
      </div>

      {isMobile && <MobileNavigation pathname={pathname} />}
    </div>
  )
}
