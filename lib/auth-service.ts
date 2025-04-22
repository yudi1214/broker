"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { query } from "@/lib/prisma"
import * as bcrypt from "bcryptjs"

// Tipos
export type UserRole = "user" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  image?: string
  demoBalance: number
  realBalance: number
}

// Funções de autenticação
export async function register(
  name: string,
  email: string,
  passwordPlain: string,
): Promise<{ success: boolean; message?: string; user?: User }> {
  console.log("Tentando registrar:", email)

  try {
    // Verificar se o email já existe
    const existingUser = await query("SELECT * FROM users WHERE email = $1", [email])
    if (existingUser.length > 0) {
      console.log("Email já existe:", email)
      return {
        success: false,
        message: "Este email já está em uso",
      }
    }

    // Hash da senha
    const password = await bcrypt.hash(passwordPlain, 10)

    // Criar novo usuário
    const result = await query(
      "INSERT INTO users (name, email, password, role, demo_balance, real_balance) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, image, demo_balance, real_balance",
      [name, email, password, "user", 10000, 0],
    )

    const newUser = result[0]
    console.log("Usuário registrado com sucesso:", email)

    // Criar sessão para o novo usuário
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      image: newUser.image,
      demoBalance: newUser.demo_balance,
      realBalance: newUser.real_balance,
    }

    const session = {
      user: sessionUser,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
    }

    // Salvar sessão em cookie
    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: "/",
    })

    return {
      success: true,
      user: sessionUser,
    }
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return {
      success: false,
      message: "Erro ao registrar usuário. Tente novamente mais tarde.",
    }
  }
}

export async function login(
  email: string,
  passwordPlain: string,
): Promise<{ success: boolean; message?: string; user?: User }> {
  console.log("Tentando login com:", email)

  try {
    // Buscar usuário pelo email
    const users = await query("SELECT * FROM users WHERE email = $1", [email])

    if (users.length === 0) {
      console.log("Usuário não encontrado")
      return {
        success: false,
        message: "Email não encontrado",
      }
    }

    const user = users[0]

    // Verificar senha
    const passwordMatch = await bcrypt.compare(passwordPlain, user.password)
    if (!passwordMatch) {
      console.log("Senha incorreta")
      return {
        success: false,
        message: "Senha incorreta",
      }
    }

    // Atualizar último login
    await query("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id])

    console.log("Login bem-sucedido para:", user.name)

    // Criar sessão
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      demoBalance: user.demo_balance,
      realBalance: user.real_balance,
    }

    const session = {
      user: sessionUser,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
    }

    // Salvar sessão em cookie
    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: "/",
    })

    return {
      success: true,
      user: sessionUser,
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return {
      success: false,
      message: "Erro ao fazer login. Tente novamente mais tarde.",
    }
  }
}

export async function logout() {
  // Limpar o cookie de sessão no servidor
  cookies().delete("session")
  try {
    redirect("/login")
  } catch (error) {
    console.error("Redirect error:", error)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()

  if (!session || !session.user) {
    return null
  }

  return session.user
}

export async function getSession() {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value)
  } catch (error) {
    console.error("Erro ao analisar cookie de sessão:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

export async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  return user
}

// Funções para gerenciar usuários
export async function updateUserBalance(
  userId: string,
  accountType: "demo" | "real",
  newBalance: number,
): Promise<boolean> {
  try {
    const field = accountType === "demo" ? "demo_balance" : "real_balance"

    await query(`UPDATE users SET ${field} = $1 WHERE id = $2`, [newBalance, userId])

    // Atualizar a sessão se for o usuário atual
    const session = await getSession()
    if (session?.user?.id === userId) {
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          demoBalance: accountType === "demo" ? newBalance : session.user.demoBalance,
          realBalance: accountType === "real" ? newBalance : session.user.realBalance,
        },
      }

      cookies().set("session", JSON.stringify(updatedSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 dias
        path: "/",
      })
    }

    return true
  } catch (error) {
    console.error("Erro ao atualizar saldo do usuário:", error)
    return false
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    // Verificar se o usuário atual é admin
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Unauthorized")
    }

    // Retornar todos os usuários sem as senhas
    const users = await query("SELECT id, name, email, role, image, demo_balance, real_balance FROM users")

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      demoBalance: user.demo_balance,
      realBalance: user.real_balance,
    }))
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return []
  }
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; email?: string; image?: string },
): Promise<boolean> {
  try {
    const currentUser = await getCurrentUser()

    // Verificar se o usuário está tentando atualizar seu próprio perfil
    if (!currentUser || (currentUser.id !== userId && currentUser.role !== "admin")) {
      throw new Error("Unauthorized")
    }

    // Verificar se o email já está em uso por outro usuário
    if (data.email) {
      const existingUser = await query("SELECT * FROM users WHERE email = $1 AND id != $2", [data.email, userId])

      if (existingUser.length > 0) {
        throw new Error("Email already in use")
      }
    }

    // Construir a consulta de atualização dinamicamente
    const updateFields = []
    const params = []
    let paramIndex = 1

    if (data.name) {
      updateFields.push(`name = $${paramIndex}`)
      params.push(data.name)
      paramIndex++
    }

    if (data.email) {
      updateFields.push(`email = $${paramIndex}`)
      params.push(data.email)
      paramIndex++
    }

    if (data.image) {
      updateFields.push(`image = $${paramIndex}`)
      params.push(data.image)
      paramIndex++
    }

    if (updateFields.length === 0) {
      return true // Nada para atualizar
    }

    params.push(userId)
    const updateQuery = `UPDATE users SET ${updateFields.join(", ")} WHERE id = $${paramIndex}`

    await query(updateQuery, params)

    // Atualizar a sessão se for o usuário atual
    if (currentUser.id === userId) {
      const session = await getSession()
      if (session) {
        const updatedSession = {
          ...session,
          user: {
            ...session.user,
            name: data.name || session.user.name,
            email: data.email || session.user.email,
            image: data.image || session.user.image,
          },
        }

        cookies().set("session", JSON.stringify(updatedSession), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60, // 7 dias
          path: "/",
        })
      }
    }

    return true
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error)
    return false
  }
}
