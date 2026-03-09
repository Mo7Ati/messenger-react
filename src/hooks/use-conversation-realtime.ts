import { useEffect } from "react"
import { useMessengerInbox } from "@/contexts/messenger-inbox-context"
import type { Message } from "@/types/general"

export function useConversationRealtime(
    chatId: number | undefined,
    appendMessage: (message: Message) => void
) {
    const { setActiveConversation } = useMessengerInbox()

    useEffect(() => {
        setActiveConversation(chatId, appendMessage)
        return () => setActiveConversation(undefined, (_msg: Message) => { })
    }, [chatId, appendMessage, setActiveConversation])
}
