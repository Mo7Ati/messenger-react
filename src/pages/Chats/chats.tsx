import { Outlet, useParams } from "react-router"
import { ChatsList } from "./components/chats-list"
import { useIsMobile } from "@/hooks/use-mobile"

const Chats = () => {
  const isMobile = useIsMobile()
  const { chatId } = useParams<{ chatId: string }>()

  return (
    <div className="flex h-full w-full space-x-6 md:p-10">
      {isMobile ? (
        chatId ? (
          <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
            <Outlet />
          </div>
        ) : (
          <ChatsList />
        )
      ) : (
        <>
          <ChatsList />
          <div className="flex-1 min-w-0 p-1 flex flex-col min-h-0">
            <Outlet />
          </div>
        </>
      )}
    </div>
  )
}

export default Chats