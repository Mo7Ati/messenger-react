import api from "@/lib/api"
import type { Chat } from "@/types/general"
import type { CreateGroupParams } from "@/types/groups"

export const groupsService = {
  getGroups: async (): Promise<Chat[]> => {
    const { data } = await api.get<Chat[]>("/groups")
    return data
  },
  getGroup: async (id: number): Promise<Chat> => {
    const { data } = await api.get<Chat>(`/groups/${id}`)
    return data
  },
  createGroup: async (params: CreateGroupParams): Promise<Chat> => {
    const { data } = await api.post<Chat>("/groups", {
      label: params.label,
      // avatar_url: params.avatar_url ?? undefined,
      participants_ids: params.participants_ids,
    })
    return data
  }
}
