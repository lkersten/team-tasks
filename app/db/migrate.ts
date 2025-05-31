import { config } from "dotenv"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"
import * as schema from "./schema"

config()

const connectionString = process.env.DATABASE_URL || 
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`

const pool = new Pool({
  connectionString,
})

const db = drizzle(pool, { schema })

async function main() {
  console.log("Migration started...")
  await migrate(db, { migrationsFolder: "drizzle" })
  console.log("Migration completed!")
  process.exit(0)
}

main().catch((err) => {
  console.error("Migration failed!")
  console.error(err)
  process.exit(1)
}) 