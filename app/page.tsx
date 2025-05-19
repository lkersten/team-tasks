import { getBoardData } from "@/actions/boardActions"
import { ClientWrapper } from "@/components/ClientWrapper"

export default async function Home() {
  const { columns, tasks } = await getBoardData()
  
  return <ClientWrapper initialColumns={columns} initialTasks={tasks} />
}
