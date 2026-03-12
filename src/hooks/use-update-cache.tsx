import type { GetContactResponse } from "@/types/contacts"
import type { Chat, Message } from "@/types/general"
import { useQueryClient } from "@tanstack/react-query"

const useUpdateCache = () => {
    const queryClient = useQueryClient()

    function syncMessage(message: Message, contactId?: number) {
        queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
            if (!chats) return chats

            return chats.map((c) => {
                if (c.id === message.chat_id) {
                    return { ...c, last_message: message, new_messages: message.is_mine ? 0 : c.new_messages + 1 }
                }
                return c
            })
        })


        queryClient.setQueryData<Chat>(["chat", message.chat_id], (chat) => {
            if (!chat) return chat

            return {
                ...chat,
                messages: [...chat.messages, message],
            }
        })


        queryClient.setQueryData<GetContactResponse>(["contact", contactId ?? message.user_id], (response) => {
            if (!response || !response.chat) return response

            const chat = response.chat

            return {
                ...response,
                chat: {
                    ...chat,
                    messages: [...chat.messages, message],
                },
            }
        })
    }

    return {
        syncMessage
    }

}

export default useUpdateCache