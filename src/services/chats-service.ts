import api from "@/lib/api"
import type { Chat } from "@/types/general"

export const chatsService = {
    getChats: async (): Promise<Chat[]> => {
        const { data } = await api.get<Chat[]>("/conversations")
        return data
    },
    getChat: async (id: number): Promise<Chat> => {
        const { data } = await api.get<Chat>(`/conversations/${id}`)
        return data
    },
}
