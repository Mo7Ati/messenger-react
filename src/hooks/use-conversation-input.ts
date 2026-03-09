import { useCallback, useEffect, useRef, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { usePublicChannel } from "./use-public-channel"

const TYPING_WHISPER_DEBOUNCE_MS = 300

export function useConversationInput(chatId: number | undefined) {
    const [input, setInput] = useState("")
    const { user: currentUser } = useAuth()
    const { channel } = usePublicChannel()
    const whisperTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (whisperTimeoutRef.current) {
                clearTimeout(whisperTimeoutRef.current)
            }
        }
    }, [])

    const onInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInput(e.target.value)

            if (!chatId) return

            if (whisperTimeoutRef.current) {
                clearTimeout(whisperTimeoutRef.current)
            }

            whisperTimeoutRef.current = setTimeout(() => {
                channel.whisper("typing", {
                    user: currentUser,
                    chatId,
                })
                whisperTimeoutRef.current = null
            }, TYPING_WHISPER_DEBOUNCE_MS)
        },
        [chatId, channel, currentUser]
    )

    const clearInput = () => setInput("")

    return { input, onInputChange, clearInput, currentUser }
}
