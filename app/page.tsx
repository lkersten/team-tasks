import { KanbanBoard } from "./components/KanbanBoard"

const initialTasks = [
  {
    id: "1",
    title: "Design new logo",
    description: "Create a modern logo for the brand",
    status: "todo",
    priority: "high",
    dueDate: new Date("2024-04-01"),
    assignee: "John Doe",
  },
  {
    id: "2",
    title: "Implement auth",
    description: "Set up authentication system",
    status: "in-progress",
    priority: "medium",
    dueDate: new Date("2024-04-15"),
  },
  {
    id: "3",
    title: "Write docs",
    status: "completed",
    priority: "low",
  },
]

export default function Page() {
  return <KanbanBoard initialTasks={initialTasks} />
}
