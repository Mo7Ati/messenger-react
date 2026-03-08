import { useDeferredValue, useMemo, useState } from "react"
import type { Chat, User } from "@/types/general"
import { useChats } from "@/pages/Chats/utils"

export function useGroups() {
  const chatsQuery = useChats()
  const groups = useMemo(
    () => (chatsQuery.data ?? []).filter((c) => c.type === "group"),
    [chatsQuery.data]
  )
  return {
    ...chatsQuery,
    data: groups,
  }
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
