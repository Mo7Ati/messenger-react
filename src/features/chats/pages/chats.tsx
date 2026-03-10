import { Outlet, useParams } from "react-router"
import { ChatsList } from "../components/chats-list"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const Chats = () => {
  const isMobile = useIsMobile()
  const { chatId } = useParams<{ chatId: string }>()

  const showChatsList = !isMobile || !chatId
  const showChatWindow = !isMobile || !!chatId

  return (
    <div
      className={cn(
        "flex h-full w-full",
        !isMobile && "space-x-6 md:p-10"
      )}
    >
      {showChatsList && <ChatsList />}

      {showChatWindow && (
        <div className="flex flex-1 min-w-0 flex-col min-h-0 p-1">
          <Outlet />
        </div>
      )}
    </div>
  )
}

export default Chats