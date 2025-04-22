"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Usar um try/catch para lidar com possíveis erros de navegação
    try {
      router.push("/dashboard/trade")
    } catch (error) {
      console.error("Erro ao redirecionar:", error)
      // Se houver erro, podemos renderizar conteúdo alternativo
      // ou tentar novamente após um delay
      setTimeout(() => {
        try {
          router.push("/dashboard/trade")
        } catch (innerError) {
          console.error("Erro ao redirecionar novamente:", innerError)
        }
      }, 1000)
    }
  }, [router])

  // Renderizar um estado de carregamento enquanto o redirecionamento acontece
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-full max-w-md space-y-4 p-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-64 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  )
}
