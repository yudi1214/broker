"use client"

import type React from "react"

import { useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

interface ToastNotificationProps {
  title: string
  description?: string
  type?: "success" | "error" | "info"
  duration?: number
  action?: React.ReactNode
}

export function showToast({ title, description, type = "info", duration = 5000, action }: ToastNotificationProps) {
  const icon =
    type === "success" ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : type === "error" ? (
      <AlertCircle className="h-5 w-5 text-red-500" />
    ) : (
      <Info className="h-5 w-5 text-blue-500" />
    )

  toast({
    title,
    description,
    duration,
    action,
    variant: type === "error" ? "destructive" : "default",
    icon: icon,
  })
}

export function ToastNotification(props: ToastNotificationProps) {
  useEffect(() => {
    showToast(props)
  }, [])

  return null
}
