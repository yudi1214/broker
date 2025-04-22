"use client"

// Mapeamento de símbolos internos para símbolos da API
const symbolMapping: Record<string, { binance?: string; yahoo?: string }> = {
  // Crypto (Binance)
  BTCUSD: { binance: "BTCUSDT" },
  ETHUSD: { binance: "ETHUSDT" },
  XRPUSD: { binance: "XRPUSDT" },
  SOLUSD: { binance: "SOLUSDT" },
  ADAUSD: { binance: "ADAUSDT" },
  DOTUSD: { binance: "DOTUSDT" },
  BNBUSD: { binance: "BNBUSDT" },
  DOGEUSD: { binance: "DOGEUSDT" },
  // Forex (Yahoo Finance)
  EURUSD: { yahoo: "EURUSD=X" },
  GBPUSD: { yahoo: "GBPUSD=X" },
  USDJPY: { yahoo: "USDJPY=X" },
  AUDUSD: { yahoo: "AUDUSD=X" },
  // Stocks (Yahoo Finance)
  AAPL: { yahoo: "AAPL" },
  MSFT: { yahoo: "MSFT" },
  GOOGL: { yahoo: "GOOGL" },
  AMZN: { yahoo: "AMZN" },
  META: { yahoo: "META" },
  TSLA: { yahoo: "TSLA" },
  NFLX: { yahoo: "NFLX" },
}

// Lista de ativos disponíveis com ícones
const assetInfo = [
  {
    id: "BTCUSD",
    name: "Bitcoin",
    symbol: "BTC/USD",
    icon: "₿",
    category: "Crypto",
  },
  {
    id: "ETHUSD",
    name: "Ethereum",
    symbol: "ETH/USD",
    icon: "Ξ",
    category: "Crypto",
  },
  {
    id: "XRPUSD",
    name: "Ripple",
    symbol: "XRP/USD",
    icon: "✗",
    category: "Crypto",
  },
  {
    id: "SOLUSD",
    name: "Solana",
    symbol: "SOL/USD",
    icon: "◎",
    category: "Crypto",
  },
  {
    id: "ADAUSD",
    name: "Cardano",
    symbol: "ADA/USD",
    icon: "₳",
    category: "Crypto",
  },
  {
    id: "DOTUSD",
    name: "Polkadot",
    symbol: "DOT/USD",
    icon: "●",
    category: "Crypto",
  },
  {
    id: "BNBUSD",
    name: "Binance Coin",
    symbol: "BNB/USD",
    icon: "🔶",
    category: "Crypto",
  },
  {
    id: "DOGEUSD",
    name: "Dogecoin",
    symbol: "DOGE/USD",
    icon: "Ð",
    category: "Crypto",
  },
  {
    id: "EURUSD",
    name: "Euro",
    symbol: "EUR/USD",
    icon: "€",
    category: "Forex",
  },
  {
    id: "GBPUSD",
    name: "British Pound",
    symbol: "GBP/USD",
    icon: "£",
    category: "Forex",
  },
  {
    id: "USDJPY",
    name: "US Dollar / Japanese Yen",
    symbol: "USD/JPY",
    icon: "¥",
    category: "Forex",
  },
  {
    id: "AUDUSD",
    name: "Australian Dollar",
    symbol: "AUD/USD",
    icon: "A$",
    category: "Forex",
  },
  {
    id: "AAPL",
    name: "Apple Inc.",
    symbol: "AAPL",
    icon: "🍎",
    category: "Stocks",
  },
  {
    id: "MSFT",
    name: "Microsoft",
    symbol: "MSFT",
    icon: "🪟",
    category: "Stocks",
  },
  {
    id: "GOOGL",
    name: "Alphabet Inc.",
    symbol: "GOOGL",
    icon: "G",
    category: "Stocks",
  },
  {
    id: "AMZN",
    name: "Amazon",
    symbol: "AMZN",
    icon: "📦",
    category: "Stocks",
  },
  {
    id: "META",
    name: "Meta Platforms",
    symbol: "META",
    icon: "M",
    category: "Stocks",
  },
  {
    id: "TSLA",
    name: "Tesla",
    symbol: "TSLA",
    icon: "⚡",
    category: "Stocks",
  },
  {
    id: "NFLX",
    name: "Netflix",
    symbol: "NFLX",
    icon: "N",
    category: "Stocks",
  },
]

// Preços base para fallback (usados quando não conseguimos obter preços reais)
const basePrices: Record<string, number> = {
  BTCUSD: 65432.1,
  ETHUSD: 3456.78,
  XRPUSD: 0.5423,
  SOLUSD: 142.87,
  ADAUSD: 0.45,
  DOTUSD: 7.82,
  BNBUSD: 567.89,
  DOGEUSD: 0.12,
  EURUSD: 1.0765,
  GBPUSD: 1.2543,
  USDJPY: 151.43,
  AUDUSD: 0.6532,
  AAPL: 178.32,
  MSFT: 425.52,
  GOOGL: 176.52,
  AMZN: 185.07,
  META: 485.58,
  TSLA: 177.29,
  NFLX: 625.43,
}

// Cache para armazenar preços recentes
const priceCache: Record<string, { price: number; timestamp: number }> = {}

// Modificar o tempo de expiração do cache para garantir dados mais frescos
// Alterar de 500ms para 100ms para obter atualizações mais frequentes

// Tempo de expiração do cache em milissegundos (100ms para atualizações muito frequentes)
const CACHE_EXPIRY = 100

// Histórico de preços para simular movimentos realistas quando necessário
const priceHistory: Record<string, number[]> = {}

// Inicializar histórico de preços
Object.keys(basePrices).forEach((symbol) => {
  priceHistory[symbol] = [basePrices[symbol]]
})

// Modificar a função getBinancePrice para forçar consultas diretas à API
async function getBinancePrice(symbol: string): Promise<number> {
  try {
    const binanceSymbol = symbolMapping[symbol]?.binance
    if (!binanceSymbol) {
      throw new Error(`Símbolo Binance não encontrado para ${symbol}`)
    }

    // Verificar cache - com tempo reduzido para 100ms
    const now = Date.now()
    if (priceCache[symbol] && now - priceCache[symbol].timestamp < CACHE_EXPIRY) {
      return priceCache[symbol].price
    }

    // API pública da Binance para preço atual
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`)

    if (!response.ok) {
      throw new Error(`Erro na API da Binance: ${response.status}`)
    }

    const data = await response.json()
    const price = Number.parseFloat(data.price)

    // Atualizar cache e histórico
    priceCache[symbol] = { price, timestamp: now }
    priceHistory[symbol] = [...(priceHistory[symbol] || []).slice(-199), price] // Aumentar o histórico para 200 entradas

    return price
  } catch (error) {
    console.error(`Erro ao obter preço da Binance para ${symbol}:`, error)
    // Fallback para preço simulado
    return generateSimulatedPrice(symbol)
  }
}

// Função para obter o preço do Yahoo Finance
async function getYahooFinancePrice(symbol: string): Promise<number> {
  try {
    const yahooSymbol = symbolMapping[symbol]?.yahoo
    if (!yahooSymbol) {
      throw new Error(`Símbolo Yahoo Finance não encontrado para ${symbol}`)
    }

    // Verificar cache
    const now = Date.now()
    if (priceCache[symbol] && now - priceCache[symbol].timestamp < CACHE_EXPIRY) {
      return priceCache[symbol].price
    }

    // Usar API do Yahoo Finance via RapidAPI
    // Nota: Em produção, você precisaria de uma chave de API válida
    // Aqui estamos usando uma API pública alternativa que não requer chave
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d`)

    if (!response.ok) {
      throw new Error(`Erro na API do Yahoo Finance: ${response.status}`)
    }

    const data = await response.json()
    const price = data.chart.result[0].meta.regularMarketPrice

    // Atualizar cache e histórico
    priceCache[symbol] = { price, timestamp: now }
    priceHistory[symbol] = [...(priceHistory[symbol] || []).slice(-99), price]

    return price
  } catch (error) {
    console.error(`Erro ao obter preço do Yahoo Finance para ${symbol}:`, error)
    // Fallback para preço simulado
    return generateSimulatedPrice(symbol)
  }
}

// Função para gerar um preço simulado com base no histórico
function generateSimulatedPrice(symbol: string): number {
  const history = priceHistory[symbol] || [basePrices[symbol] || 100]
  const lastPrice = history[history.length - 1]

  // Gerar uma variação realista baseada no último preço
  // Maior volatilidade para crypto, menor para forex e stocks
  let volatility = 0.001 // 0.1% padrão

  if (symbol.includes("BTC") || symbol.includes("ETH")) {
    volatility = 0.003 // 0.3% para Bitcoin e Ethereum
  } else if (symbol.includes("USD")) {
    volatility = 0.0005 // 0.05% para pares forex
  }

  // Gerar movimento de preço com tendência (70% chance de seguir a tendência anterior)
  const previousMove = history.length > 1 ? history[history.length - 1] - history[history.length - 2] : 0
  const trend = previousMove !== 0 ? Math.sign(previousMove) : 0

  // 70% chance de seguir a tendência, 30% de reverter
  const followTrend = Math.random() < 0.7
  const direction = followTrend ? trend : -trend

  // Calcular a variação com base na volatilidade e direção
  const change = lastPrice * volatility * (direction !== 0 ? direction : Math.random() > 0.5 ? 1 : -1)
  const newPrice = lastPrice + change

  // Arredondar para 2 casas decimais para a maioria dos ativos, 5 para cripto de baixo valor
  const decimals = symbol.includes("XRP") || symbol.includes("ADA") || symbol.includes("DOGE") ? 5 : 2
  const roundedPrice = Number(newPrice.toFixed(decimals))

  // Adicionar ao histórico (manter apenas os últimos 100 preços)
  priceHistory[symbol] = [...history.slice(-99), roundedPrice]

  return roundedPrice
}

/**
 * Gera um preço base para um símbolo
 */
function getBasePrice(symbol: string): number {
  // Preços base para diferentes tipos de ativos
  if (symbol.includes("BTC")) return 50000 + Math.random() * 5000
  if (symbol.includes("ETH")) return 3000 + Math.random() * 300
  if (symbol.includes("BNB")) return 500 + Math.random() * 50
  if (symbol.includes("USD")) return 1 + Math.random() * 0.1
  if (symbol.includes("EUR")) return 1.1 + Math.random() * 0.1
  if (symbol.includes("GBP")) return 1.3 + Math.random() * 0.1
  if (symbol.includes("JPY")) return 0.009 + Math.random() * 0.001
  if (symbol.includes("GOLD")) return 1800 + Math.random() * 50
  if (symbol.includes("SILVER")) return 25 + Math.random() * 5

  // Para outros símbolos
  return 100 + Math.random() * 10
}

// Modificar a função getAssetPrice para priorizar a API da Binance
export async function getAssetPrice(symbol: string): Promise<number> {
  // Para Bitcoin, sempre tentar a API da Binance primeiro
  if (symbol === "BTCUSD" || symbol.includes("BTC")) {
    try {
      const binanceSymbol = "BTCUSDT" // Símbolo do Bitcoin na Binance
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch price from Binance: ${response.statusText}`)
      }

      const data = await response.json()
      const price = Number.parseFloat(data.price)

      // Atualiza o cache com tempo reduzido
      const now = Date.now()
      priceCache[symbol] = { price, timestamp: now }

      return price
    } catch (error) {
      console.error("Error fetching Bitcoin price from Binance:", error)
      // Se falhar, continua com o fluxo normal
    }
  }

  // Código existente para outros ativos...
  // Verifica se temos um preço em cache que ainda é válido
  const cachedData = priceCache[symbol]
  const now = Date.now()

  if (cachedData && now - cachedData.timestamp < CACHE_EXPIRY) {
    return cachedData.price
  }

  try {
    // Para símbolos de criptomoedas, use a API da Binance
    if (symbol.includes("BTC") || symbol.includes("ETH") || symbol.includes("BNB")) {
      const formattedSymbol = symbol.replace("/", "")
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${formattedSymbol}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch price from Binance: ${response.statusText}`)
      }

      const data = await response.json()
      const price = Number.parseFloat(data.price)

      // Atualiza o cache
      priceCache[symbol] = { price, timestamp: now }

      return price
    }
    // Para outros símbolos, use uma simulação de preço
    else {
      // Se não tivermos um preço em cache, gere um preço inicial
      if (!cachedData) {
        const basePrice = getBasePrice(symbol)
        priceCache[symbol] = { price: basePrice, timestamp: now }
        return basePrice
      }

      // Simula uma pequena variação no preço
      const previousPrice = cachedData.price
      const change = previousPrice * (Math.random() * 0.02 - 0.01) // Variação de -1% a +1%
      const newPrice = previousPrice + change

      // Atualiza o cache
      priceCache[symbol] = { price: newPrice, timestamp: now }

      return newPrice
    }
  } catch (error) {
    console.error("Error fetching asset price:", error)

    // Em caso de erro, retorna o último preço conhecido ou um preço base
    if (cachedData) {
      return cachedData.price
    }

    return getBasePrice(symbol)
  }
}

// Função para obter o preço mais recente de um ativo
export async function getLatestPrice(symbol: string): Promise<{ price: number }> {
  try {
    let price: number

    // Determinar qual API usar com base na categoria do ativo
    const asset = assetInfo.find((a) => a.id === symbol)

    if (asset?.category === "Crypto") {
      price = await getBinancePrice(symbol)
    } else {
      // Forex ou Stocks
      price = await getYahooFinancePrice(symbol)
    }

    return { price }
  } catch (error) {
    console.error("Erro ao obter preço:", error)
    // Fallback para preço simulado em caso de erro
    return { price: generateSimulatedPrice(symbol) }
  }
}

// Manter a função getAssetPrice para compatibilidade com código existente
//export const getAssetPrice = getLatestPrice

// Função para buscar dados de mercado
export async function fetchMarketData(symbol?: string): Promise<any[]> {
  try {
    // Se um símbolo específico for fornecido, buscar apenas esse ativo
    if (symbol) {
      const asset = assetInfo.find((a) => a.id === symbol)
      if (!asset) {
        throw new Error(`Ativo não encontrado: ${symbol}`)
      }

      const priceData = await getLatestPrice(symbol)

      return [
        {
          ...asset,
          price: priceData.price || 0,
        },
      ]
    }

    // Caso contrário, buscar todos os ativos disponíveis
    const assetsWithPrices = await Promise.all(
      assetInfo.map(async (asset) => {
        const priceData = await getLatestPrice(asset.id)
        return {
          ...asset,
          price: priceData.price || 0,
        }
      }),
    )

    return assetsWithPrices
  } catch (error) {
    console.error("Erro ao buscar dados de mercado:", error)

    // Em caso de erro, retornar os dados com preços simulados
    return assetInfo.map((asset) => {
      const simulatedPrice = generateSimulatedPrice(asset.id)
      return {
        ...asset,
        price: simulatedPrice,
      }
    })
  }
}

// Função para calcular a variação de preço
export function getPriceChange(symbol: string): {
  value: number
  percentage: number
  direction: "up" | "down" | "neutral"
} {
  // Obter o histórico de preços
  const history = priceHistory[symbol] || []

  // Se não houver histórico suficiente, retornar valores neutros
  if (history.length < 2) {
    return {
      value: 0,
      percentage: 0,
      direction: "neutral",
    }
  }

  const currentPrice = history[history.length - 1]
  const previousPrice = history[history.length - 2]

  const value = currentPrice - previousPrice
  const percentage = previousPrice !== 0 ? (value / previousPrice) * 100 : 0

  let direction: "up" | "down" | "neutral" = "neutral"
  if (value > 0) {
    direction = "up"
  } else if (value < 0) {
    direction = "down"
  }

  return {
    value,
    percentage,
    direction,
  }
}
