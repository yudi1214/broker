import { query } from "@/lib/prisma"

export const AssetService = {
  // Obter todos os ativos
  getAllAssets: async () => {
    try {
      const result = await query(`
        SELECT 
          id, name, symbol, price, type, icon, 
          active, payout, trading_view_symbol as "tradingViewSymbol"
        FROM assets
        ORDER BY name
      `)

      // Se não houver ativos no banco de dados, retornar dados de exemplo
      if (result.length === 0) {
        return [
          {
            id: "1",
            name: "Bitcoin",
            symbol: "BTC/USD",
            price: 50000,
            type: "crypto",
            icon: "/assets/crypto/btc.png",
            active: true,
            payout: 0.85,
            tradingViewSymbol: "BINANCE:BTCUSDT",
          },
          {
            id: "2",
            name: "Ethereum",
            symbol: "ETH/USD",
            price: 3000,
            type: "crypto",
            icon: "/assets/crypto/eth.png",
            active: true,
            payout: 0.85,
            tradingViewSymbol: "BINANCE:ETHUSDT",
          },
          {
            id: "3",
            name: "EUR/USD",
            symbol: "EUR/USD",
            price: 1.1,
            type: "forex",
            icon: "/assets/forex/eurusd.png",
            active: true,
            payout: 0.85,
            tradingViewSymbol: "OANDA:EURUSD",
          },
        ]
      }

      return result
    } catch (error) {
      console.error("Erro ao buscar ativos:", error)
      return []
    }
  },

  // Obter ativo por ID
  getAssetById: async (assetId: string) => {
    try {
      const result = await query(
        `
        SELECT 
          id, name, symbol, price, type, icon, 
          active, payout, trading_view_symbol as "tradingViewSymbol"
        FROM assets
        WHERE id = $1
      `,
        [assetId],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao buscar ativo por ID:", error)
      return null
    }
  },

  // Obter ativo por símbolo
  getAssetBySymbol: async (symbol: string) => {
    try {
      const result = await query(
        `
        SELECT 
          id, name, symbol, price, type, icon, 
          active, payout, trading_view_symbol as "tradingViewSymbol"
        FROM assets
        WHERE symbol = $1
      `,
        [symbol],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao buscar ativo por símbolo:", error)
      return null
    }
  },

  // Atualizar preço do ativo
  updateAssetPrice: async (assetId: string, price: number) => {
    try {
      await query(
        `
        UPDATE assets
        SET price = $1, updated_at = NOW()
        WHERE id = $2
      `,
        [price, assetId],
      )

      return true
    } catch (error) {
      console.error("Erro ao atualizar preço do ativo:", error)
      return false
    }
  },

  // Criar ativo
  createAsset: async (assetData: any) => {
    try {
      const result = await query(
        `
        INSERT INTO assets (
          name, symbol, price, type, icon, active, payout, trading_view_symbol
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING 
          id, name, symbol, price, type, icon, 
          active, payout, trading_view_symbol as "tradingViewSymbol"
      `,
        [
          assetData.name,
          assetData.symbol,
          assetData.price || 0,
          assetData.type || "crypto",
          assetData.icon || "",
          assetData.active !== undefined ? assetData.active : true,
          assetData.payout || 0.85,
          assetData.tradingViewSymbol || "",
        ],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao criar ativo:", error)
      return null
    }
  },

  // Atualizar ativo
  updateAsset: async (assetId: string, assetData: any) => {
    try {
      // Construir a consulta de atualização dinamicamente
      const updateFields = []
      const params = []
      let paramIndex = 1

      if (assetData.name !== undefined) {
        updateFields.push(`name = $${paramIndex}`)
        params.push(assetData.name)
        paramIndex++
      }

      if (assetData.symbol !== undefined) {
        updateFields.push(`symbol = $${paramIndex}`)
        params.push(assetData.symbol)
        paramIndex++
      }

      if (assetData.price !== undefined) {
        updateFields.push(`price = $${paramIndex}`)
        params.push(assetData.price)
        paramIndex++
      }

      if (assetData.type !== undefined) {
        updateFields.push(`type = $${paramIndex}`)
        params.push(assetData.type)
        paramIndex++
      }

      if (assetData.icon !== undefined) {
        updateFields.push(`icon = $${paramIndex}`)
        params.push(assetData.icon)
        paramIndex++
      }

      if (assetData.active !== undefined) {
        updateFields.push(`active = $${paramIndex}`)
        params.push(assetData.active)
        paramIndex++
      }

      if (assetData.payout !== undefined) {
        updateFields.push(`payout = $${paramIndex}`)
        params.push(assetData.payout)
        paramIndex++
      }

      if (assetData.tradingViewSymbol !== undefined) {
        updateFields.push(`trading_view_symbol = $${paramIndex}`)
        params.push(assetData.tradingViewSymbol)
        paramIndex++
      }

      if (updateFields.length === 0) {
        return null // Nada para atualizar
      }

      updateFields.push(`updated_at = NOW()`)

      params.push(assetId)
      const updateQuery = `
        UPDATE assets
        SET ${updateFields.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING 
          id, name, symbol, price, type, icon, 
          active, payout, trading_view_symbol as "tradingViewSymbol"
      `

      const result = await query(updateQuery, params)

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao atualizar ativo:", error)
      return null
    }
  },

  // Alternar status do ativo (ativo/inativo)
  toggleAssetStatus: async (assetId: string) => {
    try {
      const result = await query(
        `
        UPDATE assets
        SET active = NOT active, updated_at = NOW()
        WHERE id = $1
        RETURNING 
          id, name, symbol, price, type, icon, 
          active, payout, trading_view_symbol as "tradingViewSymbol"
      `,
        [assetId],
      )

      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error("Erro ao alternar status do ativo:", error)
      return null
    }
  },

  // Excluir ativo
  deleteAsset: async (assetId: string) => {
    try {
      await query("DELETE FROM assets WHERE id = $1", [assetId])
      return true
    } catch (error) {
      console.error("Erro ao excluir ativo:", error)
      return false
    }
  },
}
