import { useEffect } from "react"
import { useMessengerInbox } from "@/features/messaging/messenger-inbox-context"
import type { Message } from "@/types/general"

export function useConversationRealtime(
    chatId: number | undefined,
    appendMessage: (message: Message) => void
) {
    const { setActiveConversation } = useMessengerInbox()

    useEffect(() => {
        setActiveConversation(chatId, appendMessage)
        return () => setActiveConversation(undefined, () => { })
    }, [chatId, appendMessage, setActiveConversation])
}
