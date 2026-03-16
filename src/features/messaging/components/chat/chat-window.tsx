import type { Message, User } from "@/types/general"
import { ChatWindowSkeleton } from "@/components/ui/chat-window-skeleton"
import { ChatMessages } from "./chat-messages"
import ChatHeader from "./chat-header"
import ChatInput from "./chat-input"
import { useEffect } from "react"
import useUpdateCache from "@/hooks/use-update-cache"


type ChatWindowProps = {
  title: string
  participants: User[]
  messages: Message[]
  newMessages: number
  typingLabel?: string
  chatId?: number
  asGroup?: boolean
  isFetching: boolean
  isSending: boolean
  onBack: () => void
  onSend: (payload: { body: string; files: File[] }) => void | Promise<void>
  onInputFocus?: () => void
}

export const ChatWindow = ({
  title,
  participants,
  newMessages,
  messages,
  typingLabel,
  chatId,
  asGroup = false,
  isFetching,
  isSending,
  onBack,
  onSend,
  onInputFocus,
}: ChatWindowProps) => {
  const { makeAsRead } = useUpdateCache()


  useEffect(() => {
    if (!chatId || newMessages <= 0) return
    makeAsRead(chatId)
  }, [chatId])


  if (isFetching) {
    return <ChatWindowSkeleton />
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {/* header */}
      <ChatHeader title={title} participants={participants} onBack={onBack} />

      {/* messages */}
      <ChatMessages messages={messages} chatType={asGroup ? "group" : "peer"} />

      {/* typing indicator */}
      {typingLabel && (
        <p className="px-4 py-1 text-sm italic text-muted-foreground">
          {typingLabel}
        </p>
      )}

      {/* input */}
      <ChatInput onSend={onSend} isSending={isSending} chatId={chatId} onFocus={onInputFocus} />
    </div >
  )
}

export default ChatWindow
