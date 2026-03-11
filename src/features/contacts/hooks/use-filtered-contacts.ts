import { useDeferredValue, useMemo, useState } from "react"
import type { User } from "@/types/general"

const getGroupLetter = (name: string): string => {
  const firstChar = (name?.[0] ?? "").toUpperCase()
  return /[A-Z]/.test(firstChar) ? firstChar : "#"
}

export function useFilteredContacts(contacts: User[] = []) {
  const [searchQuery, setSearchQuery] = useState("")

  const deferredSearchQuery = useDeferredValue(searchQuery)

  const filteredContacts = useMemo(() => {
    if (!contacts.length) return []
    const q = deferredSearchQuery.trim().toLowerCase()
    if (!q) return contacts
    return contacts.filter(
      (contact) =>
        contact.username.toLowerCase().includes(q) ||
        contact.email?.toLowerCase().includes(q)
    )
  }, [contacts, deferredSearchQuery])

  const groupedContacts = useMemo(() => {
    const groups: Record<string, User[]> = {}
    const sorted = [...filteredContacts].sort((a, b) =>
      a.username.localeCompare(b.username, undefined, { sensitivity: "base" })
    )

    for (const contact of sorted) {
      const letter = getGroupLetter(contact.username)
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(contact)
    }

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredContacts])

  const hasContacts = contacts.length > 0
  const hasSearchQuery = deferredSearchQuery.trim().length > 0
  const isEmpty = !hasContacts
  const isSearchNoResults = hasSearchQuery && filteredContacts.length === 0

  const emptyState = useMemo(() => {
    if (isEmpty) return "no-contacts-list" as const
    if (isSearchNoResults) return "no-search-results" as const
    return null
  }, [isEmpty, isSearchNoResults])

  return {
    searchQuery,
    setSearchQuery,
    filteredContacts,
    groupedContacts,
    hasContacts,
    hasSearchQuery,
    isEmpty,
    isSearchNoResults,
    emptyState,
  }
}
