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
  useDroppable,
  useDraggable,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { TaskCard } from "./TaskCard"
import { TaskDialog } from "./TaskDialog"
import type { Task, Column } from "../db/schema"
import { addTask, updateTask, deleteTask } from "../actions/boardActions"

// Create Droppable component
function Droppable({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id })
  return <div ref={setNodeRef}>{children}</div>
}

// Create Draggable component
function Draggable({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  )
}

interface KanbanBoardProps {
  initialColumns: Column[]
  initialTasks: Task[]
}

export function KanbanBoard({ initialColumns, initialTasks }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const taskId = Number(active.id)
    const newColumnId = Number(over.id)
    
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, columnId: newColumnId } : task
      )
    )
    setActiveTask(null)
  }

  const handleEditTask = async (task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId)
      setTasks(tasks.filter(t => t.id !== taskId))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleSaveTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingTask) {
        const updatedTask = await updateTask({ ...taskData, id: editingTask.id } as Task)
        setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
      } else {
        const newTask = await addTask(taskData)
        setTasks([...tasks, newTask])
      }
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <Button onClick={() => {
          setEditingTask(null)
          setIsDialogOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid flex-1 grid-cols-3 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{column.title}</h2>
                <span className="text-sm text-muted-foreground">
                  {tasks.filter((task) => task.columnId === column.id).length}
                </span>
              </div>
              <Droppable id={column.id.toString()}>
                <div className="flex-1 space-y-4 rounded-lg border p-4">
                  {tasks
                    .filter((task) => task.columnId === column.id)
                    .map((task) => (
                      <Draggable key={task.id} id={task.id.toString()}>
                        <TaskCard
                          task={task}
                          onEdit={() => handleEditTask(task)}
                          onDelete={() => handleDeleteTask(task.id)}
                        />
                      </Draggable>
                    ))}
                </div>
              </Droppable>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
        columns={columns}
      />
    </div>
  )
} 