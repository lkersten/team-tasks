"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { TaskCard } from "./TaskCard"
import { TaskDialog } from "./TaskDialog"
import { format } from "date-fns"

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in-progress" | "completed"
  dueDate?: Date
  assignee?: string
  priority?: "low" | "medium" | "high"
}

interface KanbanBoardProps {
  initialTasks: Task[]
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const columns = [
    { id: "todo", title: "Todo" },
    { id: "in-progress", title: "In Progress" },
    { id: "completed", title: "Completed" },
  ]

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === active.id
          ? { ...task, status: over.id as Task["status"] }
          : task
      )
    )
    setActiveTask(null)
  }

  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task])
  }

  const handleEditTask = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, ...task } : t))
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-[calc(100vh-4rem)] p-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">{column.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingTask(null)
                  setIsDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            <ScrollArea className="flex-1 rounded-md border p-4">
              <SortableContext
                items={tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-4">
                  {tasks
                    .filter((task) => task.status === column.id)
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => {
                          setEditingTask(task)
                          setIsDialogOpen(true)
                        }}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    ))}
                </div>
              </SortableContext>
            </ScrollArea>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} />}
      </DragOverlay>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        onSave={editingTask ? handleEditTask : handleAddTask}
      />
    </DndContext>
  )
} 