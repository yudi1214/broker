"use client"

import { useState, useEffect, useRef } from "react"

// Cache global para compartilhar preços entre componentes
const priceCache: Record<
  string,
  {
    price: number
    previousPrice: number | null
    lastUpdate: Date
    change24h: number
    subscribers: number
  }
> = {}

// Função para obter o preço atual de um ativo da API da Binance
async function fetchPrice(symbol: string): Promise<{ price: number; change24h: number }> {
  try {
    // Para criptomoedas, usamos a API da Binance
    if (symbol.includes("USDT")) {
      // Preço atual
      const priceResponse = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
      if (!priceResponse.ok) throw new Error("Falha ao obter preço da Binance")
      const priceData = await priceResponse.json()

      // Variação 24h
      const statsResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
      if (!statsResponse.ok) throw new Error("Falha ao obter estatísticas da Binance")
      const statsData = await statsResponse.json()

      return {
        price: Number.parseFloat(priceData.price),
        change24h: Number.parseFloat(statsData.priceChangePercent),
      }
    }

    // Para outros ativos (forex, ações, etc.), usamos uma simulação realista
    return simulatePrice(symbol)
  } catch (error) {
    console.error(`Erro ao buscar preço para ${symbol}:`, error)
    return simulatePrice(symbol)
  }
}

// Função para simular preços para ativos não-cripto
function simulatePrice(symbol: string): { price: number; change24h: number } {
  // Preços base para diferentes tipos de ativos
  const basePrice = getBasePrice(symbol)

  // Simular uma pequena variação aleatória
  const variation = basePrice * (Math.random() * 0.02 - 0.01) // -1% a +1%
  const price = basePrice + variation

  // Simular variação de 24h
  const change24h = Math.random() * 4 - 2 // -2% a +2%

  return { price, change24h }
}

// Função para obter preço base para simulação
function getBasePrice(symbol: string): number {
  if (symbol === "EURUSD") return 1.08
  if (symbol === "GBPUSD") return 1.25
  if (symbol === "USDJPY") return 151.5
  if (symbol === "AUDUSD") return 0.65
  if (symbol === "AAPL") return 178.72
  if (symbol === "MSFT") return 425.52
  if (symbol === "GOOGL") return 176.52
  if (symbol === "AMZN") return 185.07
  if (symbol === "META") return 485.58
  if (symbol === "TSLA") return 177.29
  if (symbol === "NFLX") return 625.43
  if (symbol === "XAUUSD") return 2320.5
  if (symbol === "XAGUSD") return 27.35
  if (symbol === "WTICOUSD") return 78.25

  // Valor padrão
  return 100.0
}

export function useRealTimePrice(symbol: string, interval = 1000) {
  const [price, setPrice] = useState<number | null>(null)
  const [previousPrice, setPreviousPrice] = useState<number | null>(null)
  const [priceHistory, setPriceHistory] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [change24h, setChange24h] = useState<number>(0)

  // Usar useRef para evitar atualizações desnecessárias
  const symbolRef = useRef(symbol)
  const intervalRef = useRef(interval)
  const isMountedRef = useRef(true)

  // Atualizar refs quando as props mudarem
  useEffect(() => {
    symbolRef.current = symbol
    intervalRef.current = interval
  }, [symbol, interval])

  useEffect(() => {
    isMountedRef.current = true

    // Inicializar o cache para este símbolo se não existir
    if (symbol && !priceCache[symbol]) {
      priceCache[symbol] = {
        price: 0,
        previousPrice: null,
        lastUpdate: new Date(),
        change24h: 0,
        subscribers: 0,
      }
    }

    // Incrementar contagem de assinantes
    if (symbol) {
      priceCache[symbol].subscribers += 1
    }

    return () => {
      isMountedRef.current = false

      // Decrementar contagem de assinantes
      if (symbol && priceCache[symbol]) {
        priceCache[symbol].subscribers -= 1
      }
    }
  }, [symbol])

  useEffect(() => {
    if (!symbol) return

    let timeoutId: NodeJS.Timeout

    const fetchPriceData = async () => {
      if (!isMountedRef.current || !symbolRef.current) return

      try {
        setIsLoading(true)

        // Verificar se o cache está atualizado (menos de 1 segundo)
        const now = new Date()
        const cachedData = priceCache[symbolRef.current]
        const isCacheValid = cachedData && now.getTime() - cachedData.lastUpdate.getTime() < 1000

        if (isCacheValid) {
          // Usar dados do cache
          setPrice(cachedData.price)
          setPreviousPrice(cachedData.previousPrice)
          setChange24h(cachedData.change24h)
          setLastUpdate(cachedData.lastUpdate)
          setError(null)
          setIsLoading(false)
        } else {
          // Buscar novos dados
          const { price: currentPrice, change24h: currentChange } = await fetchPrice(symbolRef.current)

          if (isMountedRef.current) {
            // Atualizar o cache
            if (priceCache[symbolRef.current]) {
              priceCache[symbolRef.current].previousPrice = priceCache[symbolRef.current].price
              priceCache[symbolRef.current].price = currentPrice
              priceCache[symbolRef.current].change24h = currentChange
              priceCache[symbolRef.current].lastUpdate = new Date()
            }

            // Atualizar o estado local
            setPreviousPrice(price)
            setPrice(currentPrice)
            setChange24h(currentChange)
            setLastUpdate(new Date())

            // Adicionar ao histórico apenas se for diferente do último preço
            if (price !== currentPrice) {
              setPriceHistory((prev) => {
                const newHistory = [...prev, currentPrice]
                // Manter apenas os últimos 100 preços
                return newHistory.slice(-100)
              })
            }

            setError(null)
            setIsLoading(false)
          }
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error("Error fetching price:", err)
          setError("Failed to fetch price")
          setIsLoading(false)
        }
      }
    }

    // Buscar dados imediatamente
    fetchPriceData()

    // Configurar intervalo para atualizações
    const scheduleNextFetch = () => {
      timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          fetchPriceData().finally(() => {
            if (isMountedRef.current) {
              scheduleNextFetch()
            }
          })
        }
      }, intervalRef.current)
    }

    scheduleNextFetch()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [symbol])

  return {
    price,
    previousPrice,
    priceHistory,
    isLoading,
    error,
    lastUpdate,
    change24h,
  }
}
