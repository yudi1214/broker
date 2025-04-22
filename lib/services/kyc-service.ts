import type { KYCVerification } from "../models/types"
import { UserService } from "./user-service"

// Dados de exemplo para KYC
const kycVerifications: KYCVerification[] = [
  {
    id: "1",
    userId: "2",
    userName: "Demo User",
    email: "user@example.com",
    status: "pending",
    documents: {
      identity: "/generic-identification-card.png",
      selfie: "/person-holding-identification.png",
      proofOfAddress: "/utility-bill-close-up.png",
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "2",
    userId: "3",
    userName: "John Doe",
    email: "john@example.com",
    status: "approved",
    documents: {
      identity: "/generic-identification-card.png",
      selfie: "/person-holding-identification.png",
      proofOfAddress: "/utility-bill-close-up.png",
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "3",
    userId: "4",
    userName: "Jane Smith",
    email: "jane@example.com",
    status: "rejected",
    documents: {
      identity: "/generic-identification-card.png",
      selfie: "/person-holding-identification.png",
      proofOfAddress: "/utility-bill-close-up.png",
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    rejectedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    rejectionReason: "Documento de identidade ilegível",
  },
]

// Serviço para gerenciar verificações KYC
export const KYCService = {
  // Obter todas as verificações KYC
  getAllKYCVerifications: async (): Promise<KYCVerification[]> => {
    return kycVerifications
  },

  // Obter verificação KYC por ID
  getKYCVerificationById: async (kycId: string): Promise<KYCVerification | null> => {
    return kycVerifications.find((kyc) => kyc.id === kycId) || null
  },

  // Obter verificação KYC por usuário
  getKYCVerificationByUser: async (userId: string): Promise<KYCVerification | null> => {
    return kycVerifications.find((kyc) => kyc.userId === userId) || null
  },

  // Criar verificação KYC
  createKYCVerification: async (kycData: Partial<KYCVerification>): Promise<KYCVerification> => {
    const newKYC: KYCVerification = {
      id: `kyc${Date.now()}`,
      userId: kycData.userId || "",
      userName: kycData.userName || "",
      email: kycData.email || "",
      status: "pending",
      documents: kycData.documents || {
        identity: "",
        selfie: "",
        proofOfAddress: "",
      },
      submittedAt: new Date().toISOString(),
      ...kycData,
    }

    kycVerifications.push(newKYC)

    // Atualizar o status KYC do usuário
    await UserService.updateUser(newKYC.userId, {
      kycStatus: "pending",
    })

    return newKYC
  },

  // Aprovar verificação KYC
  approveKYCVerification: async (kycId: string): Promise<KYCVerification | null> => {
    const kycIndex = kycVerifications.findIndex((kyc) => kyc.id === kycId)
    if (kycIndex === -1 || kycVerifications[kycIndex].status !== "pending") {
      return null
    }

    const updatedKYC: KYCVerification = {
      ...kycVerifications[kycIndex],
      status: "approved",
      approvedAt: new Date().toISOString(),
    }

    kycVerifications[kycIndex] = updatedKYC

    // Atualizar o status KYC do usuário
    await UserService.updateUser(updatedKYC.userId, {
      kycStatus: "verified",
    })

    return updatedKYC
  },

  // Rejeitar verificação KYC
  rejectKYCVerification: async (kycId: string, reason: string): Promise<KYCVerification | null> => {
    const kycIndex = kycVerifications.findIndex((kyc) => kyc.id === kycId)
    if (kycIndex === -1 || kycVerifications[kycIndex].status !== "pending") {
      return null
    }

    const updatedKYC: KYCVerification = {
      ...kycVerifications[kycIndex],
      status: "rejected",
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
    }

    kycVerifications[kycIndex] = updatedKYC

    // Atualizar o status KYC do usuário
    await UserService.updateUser(updatedKYC.userId, {
      kycStatus: "rejected",
    })

    return updatedKYC
  },
}
