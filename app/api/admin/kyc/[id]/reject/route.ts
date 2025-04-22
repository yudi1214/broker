import { type NextRequest, NextResponse } from "next/server"
import { KYCService } from "@/lib/services/kyc-service"
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

    // Rejeitar verificação KYC
    const kycVerification = await KYCService.rejectKYCVerification(params.id, reason)

    if (!kycVerification) {
      return NextResponse.json({ error: "KYC verification not found or already processed" }, { status: 404 })
    }

    return NextResponse.json({ kycVerification })
  } catch (error) {
    console.error("Error rejecting KYC verification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
