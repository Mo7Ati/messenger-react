import { useMemo } from "react"
import { useChat } from "@/features/chats/hooks/use-chats-queries"
import { useContact } from "@/features/contacts/hooks/use-contacts-queries"
import type { ConversationType, Message, User } from "@/types/general"

export type ConversationArgs =
    | { mode: "chat"; chatId: number }
    | { mode: "contact"; contactId: number }

export type ResolvedConversation = {
    chatId: number | undefined
    contactId: number | undefined
    title: string
    conversationType: ConversationType
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
                conversationType: chat?.type ?? "peer",
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
            conversationType: "peer",
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
