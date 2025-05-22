import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const columns = pgTable("columns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  assignee: text("assignee"),
  status: text("status").notNull().default("todo"),
  priority: text("priority").notNull().default("medium"),
  columnId: integer("column_id").notNull(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Define relations
export const columnsRelations = relations(columns, ({ many }) => ({
  tasks: many(tasks),
}))

export const tasksRelations = relations(tasks, ({ one }) => ({
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id],
  }),
}))

export type Column = typeof columns.$inferSelect
export type Task = typeof tasks.$inferSelect 