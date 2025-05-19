"use client"

import { KanbanBoard } from "./KanbanBoard"
import { Column, Task } from "@/db/schema"

interface KanbanBoardWrapperProps {
  initialColumns: Column[]
  initialTasks: Task[]
}

export function KanbanBoardWrapper({ initialColumns, initialTasks }: KanbanBoardWrapperProps) {
  return <KanbanBoard initialColumns={initialColumns} initialTasks={initialTasks} />
} 