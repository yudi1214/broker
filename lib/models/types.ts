// Tipos e interfaces para o backend

// Usuário
export interface User {
  id: string
  name: string
  email: string
  password: string // Em produção, seria um hash
  role: "admin" | "user" | "affiliate"
  status: "active" | "blocked"
  demoBalance: number
  realBalance: number
  image?: string
  createdAt: string
  lastLogin?: string

  // Informações pessoais
  cpf?: string
  birthdate?: string
  phone?: string
  address?: string
  city?: string
  country?: string

  // Informações financeiras
  currency?: string
  pixKeyType?: "cpf" | "email" | "phone" | "random"
  pixKey?: string

  // Configurações
  payout?: number
  dailyLimit?: number
  depositLimit?: number
  withdrawLimit?: number
  maxTradeAmount?: number
  minTradeAmount?: number

  // KYC
  kycStatus?: "not_submitted" | "pending" | "verified" | "rejected"
  kycRejectionReason?: string

  // 2FA
  twoFactorEnabled?: boolean
}

// Transação
export interface Transaction {
  id: string
  userId?: string
  customerId?: string // ID do cliente na XGate
  type: "deposit" | "withdrawal"
  amount: number
  status: "pending" | "approved" | "rejected"
  method: "pix" | "credit_card" | "bank_transfer"
  timestamp: string
  accountType: "demo" | "real"
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  transactionDetails?: Record<string, any>
  pixCode?: string // Código PIX gerado pela XGate
}

// Aposta/Trade
export interface Trade {
  id: string
  userId: string
  asset: string
  amount: number
  direction: "up" | "down"
  timeframe: string
  entryPrice: number
  exitPrice: number
  result: "win" | "loss" | "pending"
  profit: number
  timestamp: string
  accountType: "demo" | "real"
  expiryTime: string
  closedAt?: string
}

// Ativo
export interface Asset {
  id: string
  name: string
  symbol: string
  price: number
  icon: string
  category: "Crypto" | "Forex" | "Stocks"
  active: boolean
  payout: number
}

// Verificação KYC
export interface KYCVerification {
  id: string
  userId: string
  userName: string
  email: string
  status: "pending" | "approved" | "rejected"
  documents: {
    identity: string
    selfie: string
    proofOfAddress: string
  }
  submittedAt: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
}

// Configurações da plataforma
export interface PlatformSettings {
  id: string
  defaultPayout: number
  minDeposit: number
  minWithdraw: number
  maintenanceMode: boolean
  allowNewRegistrations: boolean
  allowWithdrawals: boolean
  defaultCurrency: string
  defaultDemoBalance: number
  withdrawalFee: number
  force2FA: boolean
  forceKYC: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  passwordPolicy: "basic" | "medium" | "strong"
  emailNotifications: boolean
  tradeNotifications: boolean
  depositNotifications: boolean
  withdrawalNotifications: boolean
  marketingNotifications: boolean
}

// Notificação
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: string
}

// Estatísticas
export interface Statistics {
  totalUsers: number
  activeUsers: number
  totalDeposits: number
  totalWithdrawals: number
  totalTrades: number
  platformProfit: number
  winRate: number
  dailyActiveUsers: number
}
