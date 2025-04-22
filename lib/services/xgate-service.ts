// URL base da API
const API_BASE_URL = "https://api.xgateglobal.com"

// Interface para o token de autenticação
interface AuthToken {
  token: string
  expiresAt: number // Timestamp de expiração
}

// Interface para o cliente
interface Customer {
  _id: string
  name: string
  phone?: string
  email?: string
  document?: string
}

// Interface para a moeda
interface Currency {
  _id: string
  name: string
  type: string
  symbol: string
}

// Interface para o depósito
interface Deposit {
  amount: number
  customerId: string
  currency: Currency
}

// Interface para a resposta do depósito
interface DepositResponse {
  message: string
  data: {
    status: string
    code: string
    id: string
    customerId: string
    qrcode?: string
  }
}

// Cache para o token e moedas
let authTokenCache: AuthToken | null = null
let currenciesCache: Currency[] | null = null

// Função para gerar um nome aleatório para o cliente
function generateRandomName(): string {
  const firstNames = [
    "João",
    "Maria",
    "Pedro",
    "Ana",
    "Carlos",
    "Juliana",
    "Lucas",
    "Mariana",
    "Rafael",
    "Fernanda",
    "Bruno",
    "Camila",
    "Diego",
    "Amanda",
    "Eduardo",
  ]

  const lastNames = [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Pereira",
    "Costa",
    "Rodrigues",
    "Almeida",
    "Nascimento",
    "Lima",
    "Araújo",
    "Fernandes",
    "Carvalho",
    "Gomes",
  ]

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

  return `${firstName} ${lastName}`
}

// Função para fazer login e obter o token JWT
async function login(): Promise<string> {
  // Verificar se já temos um token válido em cache
  if (authTokenCache && authTokenCache.expiresAt > Date.now()) {
    return authTokenCache.token
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "galdianolopes.jr@gmail.com",
        password: "aZX07ke3yjloceRLs5f83xAI",
      }),
    })

    if (!response.ok) {
      throw new Error(`Erro ao fazer login: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Armazenar o token em cache com expiração de 1 hora
    authTokenCache = {
      token: data.token,
      expiresAt: Date.now() + 3600000, // 1 hora
    }

    return data.token
  } catch (error) {
    console.error("Erro ao fazer login na XGate:", error)
    throw error
  }
}

// Função para criar um cliente
async function createCustomer(name?: string): Promise<string> {
  try {
    const token = await login()

    // Usar o nome fornecido ou gerar um nome aleatório
    const customerName = name || generateRandomName()

    const response = await fetch(`${API_BASE_URL}/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: customerName,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erro ao criar cliente: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.customer._id
  } catch (error) {
    console.error("Erro ao criar cliente na XGate:", error)
    throw error
  }
}

// Função para buscar as moedas disponíveis
async function getCurrencies(): Promise<Currency[]> {
  // Verificar se já temos as moedas em cache
  if (currenciesCache) {
    return currenciesCache
  }

  try {
    const token = await login()

    const response = await fetch(`${API_BASE_URL}/deposit/company/currencies`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar moedas: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Armazenar as moedas em cache
    currenciesCache = data

    return data
  } catch (error) {
    console.error("Erro ao buscar moedas na XGate:", error)
    throw error
  }
}

// Função para criar um depósito
async function createDeposit(amount: number): Promise<DepositResponse> {
  try {
    // Obter o token JWT
    const token = await login()

    // Criar um cliente
    const customerId = await createCustomer()

    // Buscar as moedas disponíveis
    const currencies = await getCurrencies()

    // Encontrar a moeda BRL
    const brlCurrency = currencies.find((currency) => currency.name === "BRL" && currency.type === "PIX")

    if (!brlCurrency) {
      throw new Error("Moeda BRL não encontrada")
    }

    // Criar o depósito
    const deposit: Deposit = {
      amount,
      customerId,
      currency: brlCurrency,
    }

    const response = await fetch(`${API_BASE_URL}/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deposit),
    })

    if (!response.ok) {
      throw new Error(`Erro ao criar depósito: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao criar depósito na XGate:", error)
    throw error
  }
}

// Exportar as funções
export const XGateService = {
  login,
  createCustomer,
  getCurrencies,
  createDeposit,
}
