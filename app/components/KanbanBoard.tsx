"use client"

import { Column, Task } from "@/db/schema"
import { useState } from "react"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { KanbanColumn } from "./KanbanColumn"

interface KanbanBoardProps {
  initialColumns: Column[]
  initialTasks: Task[]
}

export function KanbanBoard({ initialColumns, initialTasks }: KanbanBoardProps) {
  const [columns] = useState(initialColumns)
  const [tasks] = useState(initialTasks)

  const handleDragEnd = (event: DragEndEvent) => {
    // We'll implement this later
  }

  return (
    <div className="flex h-full">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4 p-4 w-full">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.columnId === column.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
} 