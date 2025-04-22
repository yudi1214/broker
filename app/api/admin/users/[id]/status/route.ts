import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/services/user-service"
import { requireAdmin } from "@/lib/auth-service"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar se o usuário é admin
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Alternar status do usuário (ativo/bloqueado)
    const updatedUser = await UserService.toggleUserStatus(params.id)

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Error toggling user status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
