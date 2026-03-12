import api from "@/lib/api"
import type { Chat, ChatType } from "@/types/general"

type CreateChatParams = {
    label: string
    participants_ids: number[]
}

export const chatsService = {
    getChats: async (params?: any): Promise<Chat[]> => {
        const { data } = await api.get<Chat[]>("/chats", { params })
        return data
    },
    getChat: async (id: number): Promise<Chat> => {
        const { data } = await api.get<Chat>(`/chats/${id}`)
        return data
    },
    createChat: async (params: CreateChatParams): Promise<Chat> => {
        const { data } = await api.post<Chat>("/chats", params)
        return data
    },
}
