import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"
import { config } from "dotenv"

// Load environment variables
config()

const connectionString = process.env.DATABASE_URL || 
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`

// Create connection pool
const pool = new Pool({
  connectionString,
})

// Create drizzle instance
const db = drizzle(pool, { schema })

async function main() {
  console.log("Seeding database...")
  
  // Create columns
  const columns = await db.insert(schema.columns).values([
    { title: "To Do", order: 0 },
    { title: "In Progress", order: 1 },
    { title: "Done", order: 2 },
  ]).returning()

  // Create tasks
  await db.insert(schema.tasks).values([
    {
      title: "Setup project",
      description: "Initialize Next.js project with Drizzle ORM",
      status: "todo",
      priority: "high",
      columnId: columns[0].id,
    },
    {
      title: "Design database schema",
      description: "Create tables for tasks and columns",
      status: "todo",
      priority: "high",
      columnId: columns[0].id,
    },
    {
      title: "Implement drag and drop",
      description: "Add DnD functionality for tasks",
      status: "in_progress",
      priority: "medium",
      columnId: columns[1].id,
    },
  ])

  console.log("Seeding completed!")
  process.exit(0)
}

main().catch((err) => {
  console.error("Seeding failed!")
  console.error(err)
  process.exit(1)
}) 