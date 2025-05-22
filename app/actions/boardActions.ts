"use server"

import { db } from "@/db/drizzle"
import { tasks, columns } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { Task } from "@/db/schema"

export async function getBoardData() {
  try {
    const columnsData = await db.select().from(columns).orderBy(columns.order)
    const tasksData = await db.select().from(tasks)
    return { columns: columnsData, tasks: tasksData }
  } catch (error) {
    console.error("Error fetching board data:", error)
    return { columns: [], tasks: [] }
  }
}

export async function addTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">) {
  try {
    const [newTask] = await db.insert(tasks).values({
      ...task,
      status: task.status || "todo",
      columnId: parseInt(task.columnId.toString()),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
    }).returning()
    revalidatePath("/")
    return newTask
  } catch (error) {
    console.error("Error adding task:", error)
    throw error
  }
}

export async function updateTask(task: Task) {
  try {
    const [updatedTask] = await db
      .update(tasks)
      .set({
        ...task,
        columnId: parseInt(task.columnId.toString()),
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, task.id))
      .returning()
    
    revalidatePath("/")
    return updatedTask
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

export async function deleteTask(id: number) {
  try {
    await db.delete(tasks).where(eq(tasks.id, id))
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
} 