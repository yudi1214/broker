"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { logout } from "@/lib/auth-service"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
}

export function LogoutButton({
  variant = "destructive",
  size = "default",
  className = "",
  showIcon = true,
}: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta",
      })
      router.push("/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar da sua conta",
        variant: "destructive",
      })
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} className={className}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      Sair da Conta
    </Button>
  )
}
