"use server"

import { cookies } from "next/headers"

// Tipos
export type UserRole = "user" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  image?: string
}

export async function getSession() {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()

  if (!session || !session.user) {
    return null
  }

  return session.user
}
