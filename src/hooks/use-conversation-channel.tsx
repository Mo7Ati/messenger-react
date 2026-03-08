import { useCallback, useEffect } from "react"
import { echo } from "@laravel/echo-react"
import type { Message } from "@/types/general"

export type MessageCreatedEvent = {
  message: Message
}

type Props = {
  chatId: number | undefined
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

/**
 * Subscribes to the conversation presence channel only when chatId is defined.
 * Uses manual Echo join/leave in useEffect so we never subscribe with an empty channel.
 */
export function useConversationChannel({ chatId, setMessages }: Props) {
  const handleMessageCreated = useCallback(
    (event: MessageCreatedEvent) => {
      setMessages((prev) => {
        const exists = prev.some((message) => message.id === event.message.id)
        if (exists) return prev
        return [...prev, event.message]
      })
    },
    [setMessages]
  )

  useEffect(() => {
    if (chatId == null) return

    const channelName = `messenger.${chatId}`
    const channel = echo().join(channelName)
    channel.listen("MessageCreated", handleMessageCreated)

    return () => {
      echo().leave(channelName)
    }
  }, [chatId, handleMessageCreated])
}