import { type NextRequest, NextResponse } from "next/server"
import { AssetService } from "@/lib/services/asset-service"
import { requireAdmin } from "@/lib/auth-service"

export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obter todos os ativos
    const assets = await AssetService.getAllAssets()
    return NextResponse.json({ assets })
  } catch (error) {
    console.error("Error fetching assets:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
