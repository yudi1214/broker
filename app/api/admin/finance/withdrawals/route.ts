import { type NextRequest, NextResponse } from "next/server"
import { FinanceService } from "@/lib/services/finance-service"
import { requireAdmin } from "@/lib/auth-service"

export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obter todos os saques
    const withdrawals = await FinanceService.getAllWithdrawals()
    return NextResponse.json({ withdrawals })
  } catch (error) {
    console.error("Error fetching withdrawals:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
