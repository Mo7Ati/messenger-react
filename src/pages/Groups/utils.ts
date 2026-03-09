import { useDeferredValue, useMemo, useState } from "react"
import type { Chat, User } from "@/types/general"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { groupsService } from "@/services/groups-service"
import type { CreateGroupParams } from "@/services/groups-service"

const groupsQueryKey = ["groups"] as const

export function useGroups() {
  return useQuery<Chat[], Error>({
    queryKey: groupsQueryKey,
    queryFn: groupsService.getGroups,
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateGroupParams) => groupsService.createGroup(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsQueryKey })
    },
  })
}

export function useGroup(id: number) {
  return useQuery<Chat, Error>({
    queryKey: ["group", id],
    queryFn: () => groupsService.getGroup(id),
  })
}

export function useFilteredGroups(groups: Chat[] = []) {
  const [searchQuery, setSearchQuery] = useState("")
  const deferredSearchQuery = useDeferredValue(searchQuery)

  const filteredGroups = useMemo(() => {
    const q = deferredSearchQuery.trim().toLowerCase()
    if (!q) return groups
    return groups.filter((chat) => {
      const matchesLabel = chat.label.toLowerCase().includes(q)
      const matchesParticipant = chat.participants?.some((p: User) =>
        p.username?.toLowerCase().includes(q)
      )
      return matchesLabel || matchesParticipant
    })
  }, [groups, deferredSearchQuery])

  return {
    searchQuery,
    setSearchQuery,
    filteredGroups,
  }
}
