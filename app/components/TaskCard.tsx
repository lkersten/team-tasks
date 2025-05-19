"use client"

import { Task } from "@/db/schema"
import { useDraggable } from "@dnd-kit/core"
import { format } from "date-fns"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id.toString(),
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 bg-card rounded-lg shadow-sm cursor-move"
    >
      <h4 className="font-medium">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
      )}
      {task.dueDate && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
          <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
        </div>
      )}
    </div>
  )
} 