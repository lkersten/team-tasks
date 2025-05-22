"use client"

import { Task, Column } from "../db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, MoreVertical, Calendar, ArrowRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

interface TaskCardProps {
  task: Task
  columns: Column[]
  onEdit?: () => void
  onDelete?: () => void
  onMove?: (taskId: number, newColumnId: number) => void
}

export function TaskCard({ task, columns, onEdit, onDelete, onMove }: TaskCardProps) {
  const availableColumns = columns.filter(col => col.id !== task.columnId)

  const formatDueDate = (date: string | Date | null) => {
    if (!date) return null
    const dateObj = typeof date === 'string' ? new Date(date + 'T12:00:00.000Z') : date
    return format(dateObj, "MMM d, yyyy", { locale: enUS })
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">{task.title}</CardTitle>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {availableColumns.length > 0 && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Move to
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {availableColumns.map((column) => (
                    <DropdownMenuItem
                      key={column.id}
                      onClick={() => onMove?.(task.id, column.id)}
                    >
                      {column.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            <DropdownMenuItem 
              onClick={onDelete} 
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{task.assignee?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {task.assignee || "Unassigned"}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            task.priority === 'high' ? 'bg-red-100 text-red-700' :
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
} 