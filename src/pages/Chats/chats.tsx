import MessengerLayout from "@/layouts/messenger-layout"
import { Outlet, useParams } from "react-router"
import { ChatsList } from "./components/chats-list"
import { useIsMobile } from "@/hooks/use-mobile"

const Chats = () => {
  const isMobile = useIsMobile()
  const { chatId } = useParams<{ chatId: string }>()

  return (
    <div className="p-5 flex h-full w-full">
      {isMobile ? (
        chatId ? (
          <div className="flex-1 min-w-0 flex flex-col">
            <Outlet />
          </div>
        ) : (
          <ChatsList />
        )
      ) : (
        <>
          <ChatsList />
          <div className="flex-1 min-w-0 p-1">
            <Outlet />
          </div>
        </>
      )}
    </div>
  )
}

export default Chats