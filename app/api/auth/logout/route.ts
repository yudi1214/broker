import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Limpar o cookie de sessão
    cookies().delete("session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
    return NextResponse.json({ success: false, message: "Falha ao fazer logout" }, { status: 500 })
  }
}
