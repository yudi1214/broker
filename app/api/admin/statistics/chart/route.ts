import { type NextRequest, NextResponse } from "next/server"
import { StatisticsService } from "@/lib/services/statistics-service"
import { requireAdmin } from "@/lib/auth-service"

export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obter dados para o gráfico do dashboard
    const chartData = await StatisticsService.getDashboardChartData()
    return NextResponse.json({ chartData })
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
