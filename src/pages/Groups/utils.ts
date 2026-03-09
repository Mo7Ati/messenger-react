import { useDeferredValue, useMemo, useState } from "react"
import type { Chat, User } from "@/types/general"
import { useQuery } from "@tanstack/react-query"
import { groupsService } from "@/services/groups-service"


export function useGroups() {
  return useQuery<Chat[], Error>({
    queryKey: ["chats"],
    queryFn: groupsService.getGroups,
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
