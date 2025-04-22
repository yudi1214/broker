import type { Transaction } from "../models/types"
import { query } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-service"

// Serviço para gerenciar transações financeiras
export const FinanceService = {
  // Obter todos os depósitos
  getAllDeposits: async (): Promise<Transaction[]> => {
    try {
      const result = await query(`
        SELECT 
          id, user_id as "userId", customer_id as "customerId", type, amount, status, 
          method, created_at as "timestamp", account_type as "accountType", 
          approved_at as "approvedAt", rejected_at as "rejectedAt", 
          rejection_reason as "rejectionReason", pix_code as "pixCode"
        FROM transactions
        WHERE type = 'deposit'
        ORDER BY created_at DESC
      `)

      return result
    } catch (error) {
      console.error("Erro ao buscar depósitos:", error)
      return []
    }
  },

  // Obter todos os saques
  getAllWithdrawals: async (): Promise<Transaction[]> => {
    try {
      const result = await query(`
        SELECT 
          id, user_id as "userId", customer_id as "customerId", type, amount, status, 
          method, created_at as "timestamp", account_type as "accountType", 
          approved_at as "approvedAt", rejected_at as "rejectedAt", 
          rejection_reason as "rejectionReason", pix_code as "pixCode"
        FROM transactions
        WHERE type = 'withdrawal'
        ORDER BY created_at DESC
      `)

      return result
    } catch (error) {
      console.error("Erro ao buscar saques:", error)
      return []
    }
  },

  // Obter depósito por ID
  getDepositById: async (depositId: string): Promise<Transaction | null> => {
    try {
      const result = await query(
        `
        SELECT 
          id, user_id as "userId", customer_id as "customerId", type, amount, status, 
          method, created_at as "timestamp", account_type as "accountType", 
          approved_at as "approvedAt", rejected_at as "rejectedAt", 
          rejection_reason as "rejectionReason", pix_code as "pixCode"
        FROM transactions
        WHERE id = $1 AND type = 'deposit'
      `,
        [depositId],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao buscar depósito por ID:", error)
      return null
    }
  },

  // Obter saque por ID
  getWithdrawalById: async (withdrawalId: string): Promise<Transaction | null> => {
    try {
      const result = await query(
        `
        SELECT 
          id, user_id as "userId", customer_id as "customerId", type, amount, status, 
          method, created_at as "timestamp", account_type as "accountType", 
          approved_at as "approvedAt", rejected_at as "rejectedAt", 
          rejection_reason as "rejectionReason", pix_code as "pixCode"
        FROM transactions
        WHERE id = $1 AND type = 'withdrawal'
      `,
        [withdrawalId],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao buscar saque por ID:", error)
      return null
    }
  },

  // Criar depósito
  createDeposit: async (depositData: Partial<Transaction>): Promise<Transaction | null> => {
    try {
      const user = await getCurrentUser()
      if (!user) return null

      const result = await query(
        `
        INSERT INTO transactions (
          user_id, customer_id, type, amount, status, method, 
          account_type, pix_code
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING 
          id, user_id as "userId", customer_id as "customerId", type, amount, status, 
          method, created_at as "timestamp", account_type as "accountType", 
          pix_code as "pixCode"
      `,
        [
          user.id,
          depositData.customerId || null,
          "deposit",
          depositData.amount || 0,
          depositData.status || "pending",
          depositData.method || "pix",
          depositData.accountType || "real",
          depositData.pixCode || null,
        ],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao criar depósito:", error)
      return null
    }
  },

  // Criar saque
  createWithdrawal: async (withdrawalData: Partial<Transaction>): Promise<Transaction | null> => {
    try {
      const user = await getCurrentUser()
      if (!user) return null

      // Verificar se o usuário tem saldo suficiente
      const accountType = withdrawalData.accountType || "real"
      const currentBalance = accountType === "real" ? user.realBalance : user.demoBalance

      if (currentBalance < (withdrawalData.amount || 0)) {
        return null
      }

      const result = await query(
        `
        INSERT INTO transactions (
          user_id, type, amount, status, method, account_type
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING 
          id, user_id as "userId", type, amount, status, 
          method, created_at as "timestamp", account_type as "accountType"
      `,
        [
          user.id,
          "withdrawal",
          withdrawalData.amount || 0,
          withdrawalData.status || "pending",
          withdrawalData.method || "pix",
          accountType,
        ],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao criar saque:", error)
      return null
    }
  },

  // Aprovar depósito
  approveDeposit: async (depositId: string): Promise<Transaction | null> => {
    try {
      // Verificar se o depósito existe e está pendente
      const deposit = await FinanceService.getDepositById(depositId)
      if (!deposit || deposit.status !== "pending") {
        return null
      }

      // Iniciar uma transação
      await query("BEGIN")

      try {
        // Atualizar o status do depósito
        const updatedDeposit = await query(
          `
          UPDATE transactions
          SET status = 'approved', approved_at = NOW()
          WHERE id = $1
          RETURNING 
            id, user_id as "userId", customer_id as "customerId", type, amount, status, 
            method, created_at as "timestamp", account_type as "accountType", 
            approved_at as "approvedAt", pix_code as "pixCode"
        `,
          [depositId],
        )

        if (updatedDeposit.length === 0) {
          throw new Error("Falha ao atualizar depósito")
        }

        // Atualizar o saldo do usuário
        const field = deposit.accountType === "demo" ? "demo_balance" : "real_balance"
        await query(
          `
          UPDATE users
          SET ${field} = ${field} + $1
          WHERE id = $2
        `,
          [deposit.amount, deposit.userId],
        )

        // Confirmar a transação
        await query("COMMIT")

        return updatedDeposit[0]
      } catch (error) {
        // Reverter a transação em caso de erro
        await query("ROLLBACK")
        console.error("Erro ao aprovar depósito:", error)
        return null
      }
    } catch (error) {
      console.error("Erro ao aprovar depósito:", error)
      return null
    }
  },

  // Rejeitar depósito
  rejectDeposit: async (depositId: string, reason: string): Promise<Transaction | null> => {
    try {
      // Verificar se o depósito existe e está pendente
      const deposit = await FinanceService.getDepositById(depositId)
      if (!deposit || deposit.status !== "pending") {
        return null
      }

      // Atualizar o status do depósito
      const result = await query(
        `
        UPDATE transactions
        SET status = 'rejected', rejected_at = NOW(), rejection_reason = $1
        WHERE id = $2
        RETURNING 
          id, user_id as "userId", customer_id as "customerId", type, amount, status, 
          method, created_at as "timestamp", account_type as "accountType", 
          rejected_at as "rejectedAt", rejection_reason as "rejectionReason"
      `,
        [reason, depositId],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao rejeitar depósito:", error)
      return null
    }
  },

  // Aprovar saque
  approveWithdrawal: async (withdrawalId: string): Promise<Transaction | null> => {
    try {
      // Verificar se o saque existe e está pendente
      const withdrawal = await FinanceService.getWithdrawalById(withdrawalId)
      if (!withdrawal || withdrawal.status !== "pending") {
        return null
      }

      // Buscar o usuário
      const userResult = await query("SELECT * FROM users WHERE id = $1", [withdrawal.userId])
      if (userResult.length === 0) {
        return null
      }

      const user = userResult[0]

      // Verificar se o usuário tem saldo suficiente
      const field = withdrawal.accountType === "demo" ? "demo_balance" : "real_balance"
      const currentBalance = withdrawal.accountType === "demo" ? user.demo_balance : user.real_balance

      if (currentBalance < withdrawal.amount) {
        return null
      }

      // Iniciar uma transação
      await query("BEGIN")

      try {
        // Atualizar o status do saque
        const updatedWithdrawal = await query(
          `
          UPDATE transactions
          SET status = 'approved', approved_at = NOW()
          WHERE id = $1
          RETURNING 
            id, user_id as "userId", type, amount, status, 
            method, created_at as "timestamp", account_type as "accountType", 
            approved_at as "approvedAt"
        `,
          [withdrawalId],
        )

        if (updatedWithdrawal.length === 0) {
          throw new Error("Falha ao atualizar saque")
        }

        // Atualizar o saldo do usuário
        await query(
          `
          UPDATE users
          SET ${field} = ${field} - $1
          WHERE id = $2
        `,
          [withdrawal.amount, withdrawal.userId],
        )

        // Confirmar a transação
        await query("COMMIT")

        return updatedWithdrawal[0]
      } catch (error) {
        // Reverter a transação em caso de erro
        await query("ROLLBACK")
        console.error("Erro ao aprovar saque:", error)
        return null
      }
    } catch (error) {
      console.error("Erro ao aprovar saque:", error)
      return null
    }
  },

  // Rejeitar saque
  rejectWithdrawal: async (withdrawalId: string, reason: string): Promise<Transaction | null> => {
    try {
      // Verificar se o saque existe e está pendente
      const withdrawal = await FinanceService.getWithdrawalById(withdrawalId)
      if (!withdrawal || withdrawal.status !== "pending") {
        return null
      }

      // Atualizar o status do saque
      const result = await query(
        `
        UPDATE transactions
        SET status = 'rejected', rejected_at = NOW(), rejection_reason = $1
        WHERE id = $2
        RETURNING 
          id, user_id as "userId", type, amount, status, 
          method, created_at as "timestamp", account_type as "accountType", 
          rejected_at as "rejectedAt", rejection_reason as "rejectionReason"
      `,
        [reason, withdrawalId],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao rejeitar saque:", error)
      return null
    }
  },
}
