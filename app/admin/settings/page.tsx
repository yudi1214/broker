import { PlatformSettings } from "@/components/admin/platform-settings"

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Configurações da Plataforma</h1>
      <PlatformSettings />
    </div>
  )
}
