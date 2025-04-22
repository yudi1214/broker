import type { PlatformSettings } from "../models/types"

// Configurações padrão da plataforma
let platformSettings: PlatformSettings = {
  id: "1",
  defaultPayout: 85,
  minDeposit: 50,
  minWithdraw: 100,
  maintenanceMode: false,
  allowNewRegistrations: true,
  allowWithdrawals: true,
  defaultCurrency: "BRL",
  defaultDemoBalance: 10000,
  withdrawalFee: 2.5,
  force2FA: false,
  forceKYC: true,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  passwordPolicy: "medium",
  emailNotifications: true,
  tradeNotifications: true,
  depositNotifications: true,
  withdrawalNotifications: true,
  marketingNotifications: false,
}

// Serviço para gerenciar configurações da plataforma
export const SettingsService = {
  // Obter configurações da plataforma
  getPlatformSettings: async (): Promise<PlatformSettings> => {
    return platformSettings
  },

  // Atualizar configurações da plataforma
  updatePlatformSettings: async (settings: Partial<PlatformSettings>): Promise<PlatformSettings> => {
    platformSettings = {
      ...platformSettings,
      ...settings,
    }
    return platformSettings
  },

  // Ativar/desativar modo de manutenção
  toggleMaintenanceMode: async (): Promise<PlatformSettings> => {
    platformSettings.maintenanceMode = !platformSettings.maintenanceMode
    return platformSettings
  },

  // Ativar/desativar novos registros
  toggleNewRegistrations: async (): Promise<PlatformSettings> => {
    platformSettings.allowNewRegistrations = !platformSettings.allowNewRegistrations
    return platformSettings
  },

  // Ativar/desativar saques
  toggleWithdrawals: async (): Promise<PlatformSettings> => {
    platformSettings.allowWithdrawals = !platformSettings.allowWithdrawals
    return platformSettings
  },
}
