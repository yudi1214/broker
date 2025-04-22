import { type NextRequest, NextResponse } from "next/server"
import { KYCService } from "@/lib/services/kyc-service"
import { requireAdmin } from "@/lib/auth-service"

export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obter todas as verificações KYC
    const kycVerifications = await KYCService.getAllKYCVerifications()
    return NextResponse.json({ kycVerifications })
  } catch (error) {
    console.error("Error fetching KYC verifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
