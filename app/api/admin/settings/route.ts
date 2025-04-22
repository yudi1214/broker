import { type NextRequest, NextResponse } from "next/server"
import { SettingsService } from "@/lib/services/settings-service"
import { requireAdmin } from "@/lib/auth-service"

export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obter configurações da plataforma
    const settings = await SettingsService.getPlatformSettings()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching platform settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Atualizar configurações da plataforma
    const settingsData = await request.json()
    const updatedSettings = await SettingsService.updatePlatformSettings(settingsData)

    return NextResponse.json({ settings: updatedSettings })
  } catch (error) {
    console.error("Error updating platform settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
