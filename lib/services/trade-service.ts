import type { Trade } from "../models/types"
import { query } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth-service"

// Serviço para gerenciar apostas/trades
export const TradeService = {
  // Obter todas as apostas
  getAllTrades: async (): Promise<Trade[]> => {
    try {
      const result = await query(`
        SELECT 
          id, user_id as "userId", asset, amount, direction, timeframe, 
          entry_price as "entryPrice", exit_price as "exitPrice", result, profit, 
          created_at as "timestamp", account_type as "accountType", 
          expiry_time as "expiryTime", closed_at as "closedAt"
        FROM operations
        ORDER BY created_at DESC
      `)

      return result
    } catch (error) {
      console.error("Erro ao buscar trades:", error)
      return []
    }
  },

  // Obter apostas por usuário
  getTradesByUser: async (userId: string): Promise<Trade[]> => {
    try {
      const result = await query(
        `
        SELECT 
          id, user_id as "userId", asset, amount, direction, timeframe, 
          entry_price as "entryPrice", exit_price as "exitPrice", result, profit, 
          created_at as "timestamp", account_type as "accountType", 
          expiry_time as "expiryTime", closed_at as "closedAt"
        FROM operations
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
        [userId],
      )

      return result
    } catch (error) {
      console.error("Erro ao buscar trades do usuário:", error)
      return []
    }
  },

  // Obter aposta por ID
  getTradeById: async (tradeId: string): Promise<Trade | null> => {
    try {
      const result = await query(
        `
        SELECT 
          id, user_id as "userId", asset, amount, direction, timeframe, 
          entry_price as "entryPrice", exit_price as "exitPrice", result, profit, 
          created_at as "timestamp", account_type as "accountType", 
          expiry_time as "expiryTime", closed_at as "closedAt"
        FROM operations
        WHERE id = $1
      `,
        [tradeId],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao buscar trade por ID:", error)
      return null
    }
  },

  // Criar aposta
  createTrade: async (tradeData: Partial<Trade>): Promise<Trade | null> => {
    try {
      // Verificar se o usuário existe e tem saldo suficiente
      const user = await getCurrentUser()
      if (!user) return null

      const accountType = tradeData.accountType || "demo"
      const currentBalance = accountType === "real" ? user.realBalance : user.demoBalance

      if (currentBalance < (tradeData.amount || 0)) {
        return null
      }

      // Deduzir o valor da aposta do saldo do usuário
      const newBalance = currentBalance - (tradeData.amount || 0)

      // Atualizar o saldo do usuário
      await query(`UPDATE users SET ${accountType === "demo" ? "demo_balance" : "real_balance"} = $1 WHERE id = $2`, [
        newBalance,
        user.id,
      ])

      // Criar a aposta
      const result = await query(
        `
        INSERT INTO operations (
          user_id, asset, amount, direction, timeframe, entry_price, 
          exit_price, result, profit, account_type, expiry_time
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING 
          id, user_id as "userId", asset, amount, direction, timeframe, 
          entry_price as "entryPrice", exit_price as "exitPrice", result, profit, 
          created_at as "timestamp", account_type as "accountType", 
          expiry_time as "expiryTime"
      `,
        [
          user.id,
          tradeData.asset || "BTC/USD",
          tradeData.amount || 0,
          tradeData.direction || "up",
          tradeData.timeframe || "5 minutos",
          tradeData.entryPrice || 0,
          0, // exitPrice será definido quando a aposta for fechada
          "pending", // result
          0, // profit
          accountType,
          tradeData.expiryTime || new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        ],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao criar trade:", error)
      return null
    }
  },

  // Fechar aposta (definir resultado)
  closeTrade: async (tradeId: string, exitPrice: number): Promise<Trade | null> => {
    try {
      // Buscar a aposta
      const trade = await TradeService.getTradeById(tradeId)
      if (!trade || trade.result !== "pending") {
        return null
      }

      // Determinar o resultado da aposta
      const isWin =
        (trade.direction === "up" && exitPrice > trade.entryPrice) ||
        (trade.direction === "down" && exitPrice < trade.entryPrice)

      // Calcular o lucro/perda
      const payout = 0.85 // 85% de payout
      const profit = isWin ? trade.amount * payout : -trade.amount

      // Atualizar a aposta
      const result = await query(
        `
        UPDATE operations
        SET exit_price = $1, result = $2, profit = $3, closed_at = NOW()
        WHERE id = $4
        RETURNING 
          id, user_id as "userId", asset, amount, direction, timeframe, 
          entry_price as "entryPrice", exit_price as "exitPrice", result, profit, 
          created_at as "timestamp", account_type as "accountType", 
          expiry_time as "expiryTime", closed_at as "closedAt"
      `,
        [exitPrice, isWin ? "win" : "loss", profit, tradeId],
      )

      const updatedTrade = result.length > 0 ? result[0] : null

      if (updatedTrade && isWin) {
        // Se o usuário ganhou, adicionar o valor ao saldo
        const user = await getCurrentUser()
        if (user) {
          const accountType = trade.accountType
          const currentBalance = accountType === "real" ? user.realBalance : user.demoBalance
          const newBalance = currentBalance + trade.amount + profit

          await query(
            `UPDATE users SET ${accountType === "demo" ? "demo_balance" : "real_balance"} = $1 WHERE id = $2`,
            [newBalance, user.id],
          )
        }
      }

      return updatedTrade
    } catch (error) {
      console.error("Erro ao fechar trade:", error)
      return null
    }
  },

  // Obter estatísticas de apostas
  getTradeStatistics: async (): Promise<any> => {
    try {
      // Total de trades
      const totalTradesResult = await query("SELECT COUNT(*) FROM operations")
      const totalTrades = Number.parseInt(totalTradesResult[0].count)

      // Trades completados
      const completedTradesResult = await query("SELECT COUNT(*) FROM operations WHERE result != $1", ["pending"])
      const completedTrades = Number.parseInt(completedTradesResult[0].count)

      // Trades ganhos
      const winningTradesResult = await query("SELECT COUNT(*) FROM operations WHERE result = $1", ["win"])
      const winningTrades = Number.parseInt(winningTradesResult[0].count)

      // Trades perdidos
      const losingTradesResult = await query("SELECT COUNT(*) FROM operations WHERE result = $1", ["loss"])
      const losingTrades = Number.parseInt(losingTradesResult[0].count)

      // Taxa de vitória
      const winRate = completedTrades > 0 ? (winningTrades / completedTrades) * 100 : 0

      // Lucro total
      const totalProfitResult = await query("SELECT SUM(profit) FROM operations")
      const totalProfit = Number.parseFloat(totalProfitResult[0].sum || 0)

      // Volume total
      const totalVolumeResult = await query("SELECT SUM(amount) FROM operations")
      const totalVolume = Number.parseFloat(totalVolumeResult[0].sum || 0)

      return {
        totalTrades,
        completedTrades,
        winningTrades,
        losingTrades,
        winRate,
        totalProfit,
        totalVolume,
      }
    } catch (error) {
      console.error("Erro ao obter estatísticas de trades:", error)
      return {
        totalTrades: 0,
        completedTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalProfit: 0,
        totalVolume: 0,
      }
    }
  },
}
