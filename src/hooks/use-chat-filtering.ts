import { useDeferredValue, useMemo, useState } from "react"
import type { Chat, User } from "@/types/general"

export function useChatFiltering(chats: Chat[] = []) {
    const [searchQuery, setSearchQuery] = useState("")
    const deferredSearchQuery = useDeferredValue(searchQuery)

    const filteredChats = useMemo(() => {
        const q = deferredSearchQuery.trim().toLowerCase()
        const sorted = [...chats].sort((a, b) =>
            b.last_message?.created_at > a.last_message?.created_at ? 1 : -1
        )
        if (!q) return sorted
        return sorted.filter((chat) => {
            const matchesLabel = chat.label.toLowerCase().includes(q)
            const matchesParticipant = chat.participants.some((p: User) =>
                p.username?.toLowerCase().includes(q)
            )
            return matchesLabel || matchesParticipant
        })
    }, [chats, deferredSearchQuery])

    return {
        searchQuery,
        setSearchQuery,
        filteredChats,
    }
}
