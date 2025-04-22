"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import type { KYCVerification } from "@/lib/models/types"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface KYCRejectedProps {
  verification: KYCVerification
  onResubmit: () => void
}

export function KYCRejected({ verification, onResubmit }: KYCRejectedProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className="font-medium text-red-500">Verificação rejeitada</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Infelizmente, sua verificação foi rejeitada pelo seguinte motivo:
        </p>
        <p className="text-sm font-medium mb-2 p-2 bg-red-100 dark:bg-red-900/30 rounded">
          {verification.rejectionReason || "Documentos não atendem aos requisitos."}
        </p>
        <p className="text-sm text-muted-foreground">
          Data de rejeição: <span className="font-medium">{formatDate(verification.rejectedAt || "")}</span>
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Recomendações</h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground mb-4">
          <li className="flex items-start gap-2">
            <span className="font-medium text-primary">•</span>
            <span>Certifique-se de que os documentos estão legíveis e não estão cortados</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-medium text-primary">•</span>
            <span>Envie documentos válidos e não expirados</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-medium text-primary">•</span>
            <span>Na selfie, seu rosto e o documento devem estar claramente visíveis</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-medium text-primary">•</span>
            <span>O comprovante de endereço deve ser recente (últimos 3 meses)</span>
          </li>
        </ul>
        <Button onClick={onResubmit} className="w-full">
          Enviar novos documentos
        </Button>
      </div>
    </div>
  )
}
