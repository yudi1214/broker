import { type NextRequest, NextResponse } from "next/server"
import { TradeService } from "@/lib/services/trade-service"
import { requireAdmin } from "@/lib/auth-service"

export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obter estatísticas de apostas
    const statistics = await TradeService.getTradeStatistics()
    return NextResponse.json({ statistics })
  } catch (error) {
    console.error("Error fetching trade statistics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
