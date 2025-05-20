import { config } from "dotenv"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// Load environment variables
config()

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

// Create drizzle instance
const db = drizzle(pool, { schema })

async function main() {
  try {
    // Delete existing columns
    await db.delete(schema.columns)
    
    // Insert default columns
    await db.insert(schema.columns).values([
      { title: "To Do", order: 0 },
      { title: "In Progress", order: 1 },
      { title: "Completed", order: 2 },
    ])

    console.log("✅ Seed completed")
  } catch (error) {
    console.error("❌ Seed failed:", error)
  } finally {
    await pool.end()
  }
}

main() 