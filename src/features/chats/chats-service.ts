import api from "@/lib/api"
import type { Chat } from "@/types/general"

export const chatsService = {
    getChats: async (): Promise<Chat[]> => {
        const { data } = await api.get<Chat[]>("/chats")
        return data
    },
    getChat: async (id: number): Promise<Chat> => {
        const { data } = await api.get<Chat>(`/chats/${id}`)
        return data
    },
}
