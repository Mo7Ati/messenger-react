import type { Message, User } from "@/types/general"
import { ChatWindowSkeleton } from "@/components/ui/chat-window-skeleton"
import { ChatMessages } from "./chat-messages"
import ChatHeader from "./chat-header"
import ChatInput from "./chat-input"


type ChatWindowProps = {
  title: string
  participants: User[]
  messages: Message[]
  asGroup?: boolean
  isPending: boolean
  isSending: boolean
  onBack: () => void
  onSend: (payload: { body: string; files: File[] }) => void | Promise<void>
}

export const ChatWindow = ({
  title,
  participants,
  messages,
  asGroup = false,
  isPending,
  isSending,
  onBack,
  onSend,
}: ChatWindowProps) => {

  if (isPending) {
    return <ChatWindowSkeleton />
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {/* header */}
      <ChatHeader title={title} participants={participants} onBack={onBack} />

      {/* messages */}
      <ChatMessages messages={messages} chatType={asGroup ? "group" : "peer"} />

      {/* input */}
      <ChatInput onSend={onSend} isSending={isSending} />
    </div >
  )
}

export default ChatWindow
