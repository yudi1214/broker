"use client"

import { useState } from "react"
import { KYCUploadForm } from "./kyc-upload-form"
import { KYCStatus } from "./kyc-status"
import { KYCApproved } from "./kyc-approved"
import { KYCRejected } from "./kyc-rejected"
import { KYCPending } from "./kyc-pending"
import { KYCService } from "@/lib/services/kyc-service"
import { useToast } from "@/hooks/use-toast"
import type { User, KYCVerification } from "@/lib/models/types"
import { Card, CardContent } from "@/components/ui/card"

interface KYCPanelProps {
  user: User
  existingVerification: KYCVerification | null
}

export function KYCPanel({ user, existingVerification }: KYCPanelProps) {
  const [verification, setVerification] = useState<KYCVerification | null>(existingVerification)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)

      // Simular upload de arquivos (em produção, usaria um serviço real de armazenamento)
      const identityFile = formData.get("identity") as File
      const selfieFile = formData.get("selfie") as File
      const addressFile = formData.get("address") as File

      // Simular URLs para os documentos
      const identityUrl = `/placeholder.svg?height=300&width=400&query=ID Document ${identityFile.name}`
      const selfieUrl = `/placeholder.svg?height=300&width=400&query=Selfie ${selfieFile.name}`
      const addressUrl = `/placeholder.svg?height=300&width=400&query=Address Proof ${addressFile.name}`

      // Criar verificação KYC
      const newVerification = await KYCService.createKYCVerification({
        userId: user.id,
        userName: user.name,
        email: user.email,
        documents: {
          identity: identityUrl,
          selfie: selfieUrl,
          proofOfAddress: addressUrl,
        },
      })

      setVerification(newVerification)
      toast({
        title: "Documentos enviados com sucesso",
        description: "Sua verificação está em análise. Você será notificado quando for concluída.",
        variant: "success",
      })
    } catch (error) {
      console.error("Erro ao enviar documentos:", error)
      toast({
        title: "Erro ao enviar documentos",
        description: "Ocorreu um erro ao enviar seus documentos. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResubmit = async () => {
    // Resetar o estado para permitir novo envio
    setVerification(null)
  }

  // Renderizar o componente apropriado com base no status da verificação
  const renderKYCComponent = () => {
    if (!verification) {
      return <KYCUploadForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    }

    switch (verification.status) {
      case "pending":
        return <KYCPending verification={verification} />
      case "approved":
        return <KYCApproved verification={verification} />
      case "rejected":
        return <KYCRejected verification={verification} onResubmit={handleResubmit} />
      default:
        return <KYCUploadForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <KYCStatus status={user.kycStatus || (verification?.status as any) || "not_submitted"} />
        <div className="mt-6">{renderKYCComponent()}</div>
      </CardContent>
    </Card>
  )
}
