import { Clock } from "lucide-react"
import type { KYCVerification } from "@/lib/models/types"
import { formatDate } from "@/lib/utils"

interface KYCPendingProps {
  verification: KYCVerification
}

export function KYCPending({ verification }: KYCPendingProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-5 w-5 text-amber-500" />
          <h3 className="font-medium">Verificação em análise</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Seus documentos foram enviados e estão sendo analisados pela nossa equipe.
        </p>
        <p className="text-sm text-muted-foreground">
          Data de envio: <span className="font-medium">{formatDate(verification.submittedAt)}</span>
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Documentos enviados</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img
                src={verification.documents.identity || "/placeholder.svg"}
                alt="Documento de identidade"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-2 text-center text-sm">Documento de identidade</div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img
                src={verification.documents.selfie || "/placeholder.svg"}
                alt="Selfie com documento"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-2 text-center text-sm">Selfie com documento</div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <img
                src={verification.documents.proofOfAddress || "/placeholder.svg"}
                alt="Comprovante de endereço"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-2 text-center text-sm">Comprovante de endereço</div>
          </div>
        </div>
      </div>
    </div>
  )
}
