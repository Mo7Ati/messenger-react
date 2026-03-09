import { useEffect } from "react"
import { echo } from "@laravel/echo-react"
import type { Message } from "@/types/general"

export type MessageCreatedPayload = {
  message: Message
}

const CHANNEL_PREFIX = "messenger.user."

/**
 * Subscribes once to the current user's private channel for all real-time messages.
 * Listens for MessageCreated and calls onMessage with the payload.
 * Caller must leave the channel on logout / unmount (cleanup in useEffect).
 */
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
