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

    // Obter estatísticas da plataforma
    const statistics = await StatisticsService.getStatistics()
    return NextResponse.json({ statistics })
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
