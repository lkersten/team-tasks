"use client"

import { Column, Task } from "@/db/schema"
import { useDroppable } from "@dnd-kit/core"
import { TaskCard } from "./TaskCard"

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id.toString(),
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 bg-muted rounded-t-lg">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="text-sm text-muted-foreground">{tasks.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 p-2 bg-muted/50 rounded-b-lg min-h-[200px]"
      >
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
} 