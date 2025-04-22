import { type NextRequest, NextResponse } from "next/server"
import { AssetService } from "@/lib/services/asset-service"
import { requireAdmin } from "@/lib/auth-service"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar se o usuário é admin
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Atualizar ativo
    const assetData = await request.json()
    const updatedAsset = await AssetService.updateAsset(params.id, assetData)

    if (!updatedAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 })
    }

    return NextResponse.json({ asset: updatedAsset })
  } catch (error) {
    console.error("Error updating asset:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
