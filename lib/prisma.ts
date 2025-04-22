import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Criar uma conexão SQL com o Neon
const sql = neon(process.env.DATABASE_URL!)

// Exportar o cliente drizzle para uso em toda a aplicação
export const db = drizzle(sql)

// Função de utilidade para executar consultas SQL diretamente
export async function query(text: string, params: any[] = []) {
  try {
    return await sql(text, params)
  } catch (error) {
    console.error("Erro na consulta SQL:", error)
    throw error
  }
}
