import { useDeferredValue, useMemo, useState } from "react"
import type { Chat, User } from "@/types/general"

export function useFilteredChats(chats: Chat[] = []) {
    const [searchQuery, setSearchQuery] = useState("")

    const deferredSearchQuery = useDeferredValue(searchQuery)

    const filteredChats = useMemo(() => {
        const q = deferredSearchQuery.trim().toLowerCase()

        if (!q) return chats

        return chats.filter((chat: Chat) => {
            const matchesLabel = chat.label.toLowerCase().includes(q)

            const matchesParticipant = chat.participants?.some((p: User) =>
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