import { getCurrentUser } from "@/lib/auth-service"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}
