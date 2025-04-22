import { type NextRequest, NextResponse } from "next/server"
import { FinanceService } from "@/lib/services/finance-service"
import { requireAdmin } from "@/lib/auth-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar se o usuário é admin
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obter motivo da rejeição
    const { reason } = await request.json()

    // Rejeitar saque
    const withdrawal = await FinanceService.rejectWithdrawal(params.id, reason)

    if (!withdrawal) {
      return NextResponse.json({ error: "Withdrawal not found or already processed" }, { status: 404 })
    }

    return NextResponse.json({ withdrawal })
  } catch (error) {
    console.error("Error rejecting withdrawal:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
