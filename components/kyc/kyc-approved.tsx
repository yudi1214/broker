import { CheckCircle, ShieldCheck } from "lucide-react"
import type { KYCVerification } from "@/lib/models/types"
import { formatDate } from "@/lib/utils"

interface KYCApprovedProps {
  verification: KYCVerification
}

export function KYCApproved({ verification }: KYCApprovedProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-4">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h3 className="font-medium text-green-500">Verificação aprovada</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-2">Parabéns! Sua identidade foi verificada com sucesso.</p>
        <p className="text-sm text-muted-foreground">
          Data de aprovação: <span className="font-medium">{formatDate(verification.approvedAt || "")}</span>
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Benefícios da verificação</h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            <span>Limites de saque aumentados</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            <span>Acesso a métodos de pagamento adicionais</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            <span>Processamento prioritário de saques</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            <span>Acesso a promoções exclusivas</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
