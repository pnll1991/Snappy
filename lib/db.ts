import { neon } from "@neondatabase/serverless"

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

let sql: ReturnType<typeof neon> | null = null

if (connectionString) {
  try {
    sql = neon(connectionString)
  } catch (error) {
    console.error("Failed to initialize Neon connection:", error)
    sql = null
  }
}

export const isDbConnected = (): boolean => {
  return !!sql
}

export const getDb = (): ReturnType<typeof neon> | null => {
  return sql
}

export { sql }

export default sql
