import { useCallback, useEffect, useState } from "react"
import type { Message } from "@/types/general"

export function useConversationMessages(
    chatId: number | undefined,
    contactId: number | undefined,
    initialMessages: Message[]
) {
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        setMessages(initialMessages)
    }, [chatId, contactId, initialMessages])

    const appendMessage = useCallback((message: Message) => {
        setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) return prev
            return [...prev, message]
        })
    }, [])

    const addOptimistic = useCallback((message: Message) => {
        setMessages((prev) => [...prev, message])
    }, [])

    const replaceOptimistic = useCallback((pendingId: string, real: Message) => {
        setMessages((prev) => prev.map((m) => (m.id === pendingId ? real : m)))
    }, [])

    const removeOptimistic = useCallback((pendingId: string) => {
        setMessages((prev) => prev.filter((m) => m.id !== pendingId))
    }, [])

    return { messages, appendMessage, addOptimistic, replaceOptimistic, removeOptimistic }
}
