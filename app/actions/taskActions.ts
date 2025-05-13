"use server"
import { db } from "@/db/drizzle"
import { tasks } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getTasks() {
  return await db.select().from(tasks)
}

export async function addTask(task: Omit<typeof tasks.$inferInsert, "id">) {
  await db.insert(tasks).values(task)
  revalidatePath("/")
}

export async function updateTask(id: number, task: Partial<typeof tasks.$inferInsert>) {
  await db.update(tasks).set(task).where(eq(tasks.id, id))
  revalidatePath("/")
}

export async function deleteTask(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id))
  revalidatePath("/")
} 