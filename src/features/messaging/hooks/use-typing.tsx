import { useUser } from "@/features/auth/auth-context"
import useChannels from "@/hooks/use-channels"
import { useEffect, useRef } from "react"

const TYPING_THROTTLE_MS = 2000
const STOP_TYPING_AFTER_MS = 2000

export function useTyping(chatId?: number) {
    const { messengerChannel } = useChannels()
    const user = useUser()

    const stopTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const lastTypingSentAtRef = useRef<number>(0)

    const sendTyping = () => {
        if (!chatId || !user) return

        messengerChannel().whisper("typing", {
            user_id: user.id,
            user_name: user.username,
            chat_id: chatId,
        })
    }

    const sendStopTyping = () => {
        if (!chatId || !user) return

        messengerChannel().whisper("stop-typing", {
            user_id: user.id,
            user_name: user.username,
            chat_id: chatId,
        })
    }

    const handleTyping = () => {
        const now = Date.now()
        const timeSinceLastTyping = now - lastTypingSentAtRef.current

        if (timeSinceLastTyping >= TYPING_THROTTLE_MS) {
            sendTyping()
            lastTypingSentAtRef.current = now
        }

        if (stopTypingTimeoutRef.current) {
            clearTimeout(stopTypingTimeoutRef.current)
        }

        stopTypingTimeoutRef.current = setTimeout(() => {
            sendStopTyping()
        }, STOP_TYPING_AFTER_MS)
    }

    useEffect(() => {
        return () => {
            if (stopTypingTimeoutRef.current) {
                clearTimeout(stopTypingTimeoutRef.current)
            }
            sendStopTyping()
        }
    }, [])

    return {
        handleTyping,
    }
}

