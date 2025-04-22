import type React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { requireAuth } from "@/lib/auth-service"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()
  return <MainLayout>{children}</MainLayout>
}
