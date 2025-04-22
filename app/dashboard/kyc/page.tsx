import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { KYCPanel } from "@/components/kyc/kyc-panel"
import { KYCService } from "@/lib/services/kyc-service"

export default async function KYCPage() {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/login")
  }

  // Buscar verificação KYC existente, se houver
  const kycVerification = await KYCService.getKYCVerificationByUser(user.id)

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Verificação de Identidade (KYC)</h1>
      <KYCPanel user={user} existingVerification={kycVerification} />
    </div>
  )
}
