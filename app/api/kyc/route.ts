import { NextResponse } from "next/server"
import { KYCService } from "@/lib/services/kyc-service"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const kycVerification = await KYCService.getKYCVerificationByUser(user.id)

    return NextResponse.json(kycVerification)
  } catch (error) {
    console.error("Erro ao buscar verificação KYC:", error)
    return NextResponse.json({ error: "Erro ao buscar verificação KYC" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const data = await request.json()

    // Verificar se já existe uma verificação pendente
    const existingVerification = await KYCService.getKYCVerificationByUser(user.id)
    if (existingVerification && existingVerification.status === "pending") {
      return NextResponse.json({ error: "Você já possui uma verificação KYC pendente" }, { status: 400 })
    }

    const kycVerification = await KYCService.createKYCVerification({
      userId: user.id,
      userName: user.name,
      email: user.email,
      documents: data.documents,
    })

    return NextResponse.json(kycVerification)
  } catch (error) {
    console.error("Erro ao criar verificação KYC:", error)
    return NextResponse.json({ error: "Erro ao criar verificação KYC" }, { status: 500 })
  }
}
