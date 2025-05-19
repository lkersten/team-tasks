"use client"

import dynamic from "next/dynamic"

const KanbanBoardWrapper = dynamic(
  () => import("@/components/KanbanBoardWrapper").then(mod => mod.KanbanBoardWrapper),
  { ssr: false }
)

interface ClientWrapperProps {
  initialColumns: any[]
  initialTasks: any[]
}

export function ClientWrapper({ initialColumns, initialTasks }: ClientWrapperProps) {
  return (
    <KanbanBoardWrapper 
      initialColumns={initialColumns} 
      initialTasks={initialTasks} 
    />
  )
} 