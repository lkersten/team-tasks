import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config()

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
}) 