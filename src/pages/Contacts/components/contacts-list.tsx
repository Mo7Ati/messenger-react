import { useState, useMemo } from "react"
import { useContacts } from '../utils'
import { ContactsSkeleton } from "./contacts-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

import { Plus, Search, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate, useParams } from "react-router"
import { EmptyState } from "@/components/empty-state"

const ContactsList = () => {
    const { contactId } = useParams<{ contactId: string }>()
    const { data: contacts, isLoading } = useContacts()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredContacts = useMemo(() => {
        if (!contacts) return []
        const q = searchQuery.trim().toLowerCase()
        if (!q) return contacts
        return contacts.filter(
            (contact) =>
                contact.name.toLowerCase().includes(q) ||
                contact.email?.toLowerCase().includes(q)
        )
    }, [contacts, searchQuery])

    const groupedContacts = useMemo(() => {
        const groups: Record<string, typeof filteredContacts> = {}
        const sorted = [...filteredContacts].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        )

        for (const contact of sorted) {
            const firstChar = (contact.name?.[0] ?? "").toUpperCase()
            const letter = /[A-Z]/.test(firstChar) ? firstChar : "#"
            if (!groups[letter]) {
                groups[letter] = []
            }
            groups[letter].push(contact)
        }

        return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
    }, [filteredContacts])

    if (isLoading) return <ContactsSkeleton />
    if (!contacts) {
        return (
            <Card className={cn(contactId && "hidden", "w-full md:w-96 h-full flex flex-col overflow-hidden")}>
                <CardHeader className="pb-3 shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-semibold">Contacts</CardTitle>
                        <Button variant="outline" className="rounded-xl" type="button" onClick={() => toast.info("Coming soon")}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Contact
                        </Button>
                    </div>
                    <div className="relative mt-3">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input className="pl-9 rounded-xl" placeholder="Contacts search..." disabled />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 p-0 mt-7 flex items-center justify-center">
                    <EmptyState variant="no-contacts-list" compact />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={cn(
            contactId && "hidden",
            "w-full md:w-96 h-full flex flex-col overflow-hidden"
        )}>
            {/* Header */}
            <CardHeader className="pb-3 shrink-0" >
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-semibold">Contacts</CardTitle>

                    <Button
                        variant="outline"
                        className="rounded-xl"
                        type="button"
                        onClick={() => toast.info("Coming soon")}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Contact
                    </Button>
                </div>

                {/* Search */}
                <div className="relative mt-3">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="pl-9 rounded-xl"
                        placeholder="Contacts search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </CardHeader>

            {/* List */}
            <CardContent className="flex-1 min-h-0 p-0 mt-7" >
                <ScrollArea className="h-full">
                    {filteredContacts.length === 0 ? (
                        <EmptyState variant="no-search-results" compact />
                    ) : (
                        <div className="pb-4">
                            {groupedContacts.map(([letter, contactsForLetter]) => (
                                <div key={letter} className="mb-4">
                                    <p className="px-4 text-xs font-semibold text-primary mb-1">
                                        {letter}
                                    </p>
                                    {contactsForLetter.map((contact) => {
                                        const active = contact.id === Number(contactId)

                                        return (
                                            <button
                                                key={contact.id}
                                                type="button"
                                                onClick={() => {
                                                    navigate(`/contacts/${contact.id}`, { state: { contact } })
                                                }}
                                                className={cn(
                                                    "w-full px-4 py-2 text-left flex items-start justify-between gap-3 cursor-pointer",
                                                    "hover:bg-muted/50 focus-visible:bg-muted/60 outline-none",
                                                    active && "bg-muted"
                                                )}
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold">
                                                        {contact.name}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {contact.bio}
                                                    </p>
                                                </div>
                                                <MoreVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default ContactsList