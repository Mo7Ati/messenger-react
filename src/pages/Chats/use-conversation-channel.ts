import type { Message, User } from "@/types/general"
import { useEchoPresence } from "@laravel/echo-react"

export type MessageCreatedEvent = {
  message: Message
}

export function useConversationChannel(
  chatId: number,
  setMessages: (messages: (prev: Message[]) => Message[]) => void
) {

  const { channel } = useEchoPresence<MessageCreatedEvent>(
    `messenger.${chatId}`,
    "MessageCreated",
    (event) => setMessages((prev) => [...prev, event.message])
  )

  channel().listen;


  const setTyping = (user: User) => {
    channel().whisper('typing', { name: user.name, avatar_url: user.avatar_url });
  }

  return {
    channel,
    setTyping
  }
}
