import { getBoardData } from "./actions/boardActions"
import { KanbanBoard } from "./components/KanbanBoard"

export default async function Home() {
  const { columns, tasks } = await getBoardData()

  return (
    <main className="container mx-auto p-4">
      <KanbanBoard initialColumns={columns} initialTasks={tasks} />
    </main>
  )
}
