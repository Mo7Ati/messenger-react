import PageLayout from "@/components/layout/page-layout"
import { useParams } from "react-router"
import { ChatsList } from "../components/chats-list"

const Chats = () => {
  const { chatId } = useParams<{ chatId: string }>()

  return (
    <PageLayout
      list={<ChatsList />}
      showDetail={!!chatId}
    />
  )
}

export default Chats