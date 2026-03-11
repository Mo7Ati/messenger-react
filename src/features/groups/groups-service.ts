import api from "@/lib/api"
import type { Chat } from "@/types/general"
import type { CreateGroupParams } from "@/types/groups"

export const groupsService = {
  getGroups: async (): Promise<Chat[]> => {
    const { data } = await api.get<Chat[]>("/chats", { params: { type: "group" } })
    return data
  },
  getGroup: async (id: number): Promise<Chat> => {
    const { data } = await api.get<Chat>(`/chats/${id}`, { params: { type: "group" } })
    return data
  },
  createGroup: async (params: CreateGroupParams): Promise<Chat> => {
    const { data } = await api.post<Chat>("/chats", {
      label: params.label,
      participants_ids: params.participants_ids,
    })
    return data
  }
}
