import type { User } from "../models/types"

// Dados de exemplo para usuários
type UserRole = "admin" | "user"

const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password", // Em produção, use hash de senha
    role: "admin" as UserRole,
    image: "",
    status: "active",
    demoBalance: 10000,
    realBalance: 5000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    lastLogin: new Date().toISOString(),
    kycStatus: "verified",
  },
  {
    id: "2",
    name: "Demo User",
    email: "user@example.com",
    password: "password", // Em produção, use hash de senha
    role: "user" as UserRole,
    image: "",
    status: "active",
    demoBalance: 5000,
    realBalance: 1000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    lastLogin: new Date().toISOString(),
    kycStatus: "not_submitted",
  },
  {
    id: "3",
    name: "Test User",
    email: "test@example.com",
    password: "test123", // Em produção, use hash de senha
    role: "user" as UserRole,
    image: "",
    status: "active",
    demoBalance: 1000,
    realBalance: 0,
  },
  {
    id: "4",
    name: "John Doe",
    email: "john@example.com",
    password: "john123", // Em produção, use hash de senha
    role: "user" as UserRole,
    image: "",
    demoBalance: 7500,
    realBalance: 2500,
  },
]

// Serviço para gerenciar usuários
export const UserService = {
  // Obter todos os usuários
  getAllUsers: async (): Promise<User[]> => {
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
  },

  // Obter usuário por ID
  getUserById: async (userId: string): Promise<User | null> => {
    const user = users.find((user) => user.id === userId)
    if (!user) return null

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  // Obter usuário por email
  getUserByEmail: async (email: string): Promise<User | null> => {
    const user = users.find((user) => user.email === email)
    if (!user) return null

    return user
  },

  // Criar usuário
  createUser: async (userData: Partial<User>): Promise<User> => {
    const newUser: User = {
      id: `user${Date.now()}`,
      name: userData.name || "",
      email: userData.email || "",
      password: userData.password || "",
      role: userData.role || "user",
      status: userData.status || "active",
      demoBalance: userData.demoBalance || 10000,
      realBalance: userData.realBalance || 0,
      createdAt: new Date().toISOString(),
      kycStatus: "not_submitted",
      ...userData,
    }

    users.push(newUser)

    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },

  // Atualizar usuário
  updateUser: async (userId: string, userData: Partial<User>): Promise<User | null> => {
    const userIndex = users.findIndex((user) => user.id === userId)
    if (userIndex === -1) return null

    const updatedUser: User = {
      ...users[userIndex],
      ...userData,
    }

    users[userIndex] = updatedUser

    const { password, ...userWithoutPassword } = updatedUser
    return userWithoutPassword
  },

  // Bloquear/desbloquear usuário
  toggleUserStatus: async (userId: string): Promise<User | null> => {
    const userIndex = users.findIndex((user) => user.id === userId)
    if (userIndex === -1) return null

    const newStatus = users[userIndex].status === "active" ? "blocked" : "active"

    const updatedUser: User = {
      ...users[userIndex],
      status: newStatus,
    }

    users[userIndex] = updatedUser

    const { password, ...userWithoutPassword } = updatedUser
    return userWithoutPassword
  },

  // Verificar credenciais
  verifyCredentials: async (email: string, password: string): Promise<User | null> => {
    const user = users.find((user) => user.email === email && user.password === password)
    if (!user) return null

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },
}
