import { KYCManagement } from "@/components/admin/kyc-management"

export default function AdminKYCPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Verificação KYC</h1>
      <KYCManagement />
    </div>
  )
}
