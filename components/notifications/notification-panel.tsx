"use client"

import { useState, useEffect } from "react"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: string
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  // Carregar notificações (simulado)
  useEffect(() => {
    // Simulação de notificações
    const demoNotifications: Notification[] = [
      {
        id: "1",
        title: "Depósito confirmado",
        message: "Seu depósito de R$ 500,00 foi confirmado e adicionado à sua conta.",
        type: "success",
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: "2",
        title: "Promoção especial",
        message: "Ganhe um bônus de 50% em seu próximo depósito. Oferta válida por 24 horas.",
        type: "info",
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "3",
        title: "Operação bem-sucedida",
        message: "Sua operação de BTC/USD foi concluída com sucesso. Lucro: R$ 85,00.",
        type: "success",
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ]

    setNotifications(demoNotifications)
    setUnreadCount(demoNotifications.filter((n) => !n.read).length)
  }, [])

  // Marcar notificação como lida
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }

  // Remover notificação
  const removeNotification = (id: string) => {
    const notification = notifications.find((n) => n.id === id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))

    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  // Formatar data relativa
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "agora mesmo"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "minuto" : "minutos"} atrás`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "hora" : "horas"} atrás`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? "dia" : "dias"} atrás`
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">Notificações</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto py-1 px-2 text-xs">
              Marcar todas como lidas
            </Button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Bell className="mb-2 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Você não tem notificações</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-1 p-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-2 rounded-md p-3 transition-colors",
                    notification.read ? "bg-background" : "bg-muted/50",
                    "hover:bg-muted",
                  )}
                >
                  <div
                    className={cn(
                      "mt-1 flex h-2 w-2 shrink-0 rounded-full",
                      notification.type === "success" && "bg-success",
                      notification.type === "error" && "bg-destructive",
                      notification.type === "warning" && "bg-warning",
                      notification.type === "info" && "bg-primary",
                    )}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium leading-none">{notification.title}</h5>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                            <span className="sr-only">Marcar como lida</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-[10px] text-muted-foreground">{formatRelativeTime(notification.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}
