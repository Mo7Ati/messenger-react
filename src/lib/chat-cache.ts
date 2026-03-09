import type { QueryClient } from "@tanstack/react-query"
import type { Chat, Message } from "@/types/general"

/**
 * Update a single chat's last_message in the cached chats list.
 * Used after sending a message (resets new_messages to 0).
 */
export function updateChatLastMessage(queryClient: QueryClient, message: Message) {
    queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
        if (!chats) return chats
        return chats.map((c) => {
            if (c.id === message.chat_id) {
                return { ...c, last_message: message, new_messages: 0 }
            }
            return c
        })
    })
}

/**
 * Sync the chats list when a new message arrives from the real-time channel.
 * Increments new_messages for incoming messages, creates a placeholder chat
 * entry if the list was empty.
 */
export function syncIncomingMessage(queryClient: QueryClient, message: Message) {
    queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
        if (!chats) return chats

        if (chats.length === 0) {
            const chat: Chat = {
                id: message.chat_id ?? 0,
                label: message.user.name ?? "unknown",
                type: "peer",
                last_message: message,
                messages: [message],
                new_messages: 1,
                created_at: message.created_at,
                participants: [message.user],
            }
            return [chat]
        }

        return chats.map((chat) => {
            if (chat.id === message.chat_id) {
                return {
                    ...chat,
                    last_message: message,
                    new_messages: message.is_mine ? chat.new_messages : chat.new_messages + 1,
                }
            }
            return chat
        })
    })
}
