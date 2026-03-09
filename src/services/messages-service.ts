import api from "@/lib/api"
import type { Message } from "@/types/general"

export type SendToConversationParams = {
    message: string
    conversation_id: number
}

export type SendToUserParams = {
    message: string
    user_id: number
}

export const messagesService = {
    sendToConversation: async (params: SendToConversationParams): Promise<Message> => {
        const { data } = await api.post<Message>("/messages", params)
        return data
    },
    sendToUser: async (params: SendToUserParams): Promise<Message> => {
        const { data } = await api.post<Message>("/messages", params)
        return data
    },
}
