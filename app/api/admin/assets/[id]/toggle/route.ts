import { type NextRequest, NextResponse } from "next/server"
import { AssetService } from "@/lib/services/asset-service"
import { requireAdmin } from "@/lib/auth-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar se o usuário é admin
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Alternar status do ativo (ativo/inativo)
    const asset = await AssetService.toggleAssetStatus(params.id)

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    return NextResponse.json({ asset })
  } catch (error) {
    console.error("Error toggling asset status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
