import { useMemo } from "react"
import { useChat } from "@/pages/Chats/hooks/use-chats-queries"
import { useContact } from "@/pages/Contacts/hooks/use-contacts-queries"
import type { Message, User } from "@/types/general"

export type ConversationArgs =
    | { mode: "chat"; chatId: number }
    | { mode: "contact"; contactId: number }

export type ResolvedConversation = {
    chatId: number | undefined
    contactId: number | undefined
    title: string
    participants: User[]
    initialMessages: Message[]
    isLoading: boolean
}

export function useConversationData(args: ConversationArgs): ResolvedConversation {
    const chatId = args.mode === "chat" ? args.chatId : undefined
    const contactId = args.mode === "contact" ? args.contactId : undefined

    const chatQuery = useChat(Number(chatId), args.mode === "chat")
    const contactQuery = useContact(Number(contactId), args.mode === "contact")

    return useMemo(() => {
        if (args.mode === "chat") {
            const chat = chatQuery.data
            return {
                chatId: chat?.id,
                contactId: undefined,
                title: chat?.label ?? "",
                participants: chat?.participants ?? [],
                initialMessages: chat?.messages ?? [],
                isLoading: chatQuery.isLoading,
            }
        }

        const data = contactQuery.data
        return {
            chatId: data?.chat?.id,
            contactId: data?.contact?.id,
            title: data?.contact?.name ?? "",
            participants: data?.contact ? [data.contact] : [],
            initialMessages: data?.chat?.messages ?? [],
            isLoading: contactQuery.isLoading || contactQuery.isPending,
        }
    }, [
        args.mode,
        chatQuery.data,
        chatQuery.isLoading,
        contactQuery.data,
        contactQuery.isLoading,
        contactQuery.isPending,
    ])
}
