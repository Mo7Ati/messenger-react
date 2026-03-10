import api from "@/lib/api"
import type { Chat, CreateGroupParams } from "@/types/general"

export const chatsService = {
    getChats: async (): Promise<Chat[]> => {
        const { data } = await api.get<Chat[]>("/chats")
        return data
    },
    getGroups: async (): Promise<Chat[]> => {
        const { data } = await api.get<Chat[]>("/chats", { params: { type: "group" } })
        return data
    },
    getChat: async (id: number): Promise<Chat> => {
        const { data } = await api.get<Chat>(`/chats/${id}`)
        return data
    },
    createGroup: async (params: CreateGroupParams): Promise<Chat> => {
        const { data } = await api.post<Chat>("/chats", {
            label: params.label,
            participants_ids: params.participants_ids,
        })
        return data
    },
}
