import { useEffect } from "react"
import { echo } from "@laravel/echo-react"
import type { Message } from "@/types/general"

export type MessageCreatedPayload = {
  message: Message
}

const CHANNEL_PREFIX = "messenger.user."


export function useUserInboxChannel(
  userId: number | null | undefined,
  onMessage: (payload: MessageCreatedPayload) => void
) {
  useEffect(() => {
    if (userId == null) return

    const channelName = CHANNEL_PREFIX + userId
    const channel = echo().private(channelName)
    channel.listen("MessageCreated", onMessage)

    return () => {
      echo().leave(channelName)
    }
  }, [userId, onMessage])
}
