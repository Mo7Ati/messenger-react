import { useContacts } from "../hooks/use-contacts-queries"
import { useFilteredContacts } from "../hooks/use-filtered-contacts"
import { ContactsSkeleton } from "./contacts-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search, MoreVertical, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link, useNavigate, useParams } from "react-router"
import { EmptyState } from "@/components/empty-state"
import { NewContactWindow } from "./new-contact-window"
import { useState } from "react"
import { toast } from "sonner"

const ContactsList = () => {
    const { contactId } = useParams<{ contactId: string }>()
    const { data: response = { data: [], status: 200, success: true, extra: { pending_requests: 0 } }, isPending, isError } = useContacts()
    const [isNewContactWindowOpen, setIsNewContactWindowOpen] = useState(false)
    const navigate = useNavigate()

    const {
        searchQuery,
        groupedContacts,
        emptyState,
        setSearchQuery,
    } = useFilteredContacts(response.data)

    if (isPending) return <ContactsSkeleton />
    if (isError) return toast.error("Failed to load contacts")

    return (
        <Card className={cn(
            contactId && "hidden",
            "w-full md:w-96 h-full flex flex-col overflow-hidden"
        )}>
            {/* Header */}
            <CardHeader className="pb-3 shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-2xl font-semibold shrink-0">Contacts</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl shrink-0"
                            asChild
                        >
                            <Link to="/contacts/requests" className="flex items-center gap-1.5">
                                <UserPlus className="h-4 w-4 shrink-0" />
                                <span>Requests</span>
                                {response.extra.pending_requests > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                                        {response.extra.pending_requests > 99 ? "99+" : response.extra.pending_requests}
                                    </span>
                                )}
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl shrink-0"
                            type="button"
                            onClick={() => setIsNewContactWindowOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-1.5" />
                            New Contact
                        </Button>
                    </div>
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
            <CardContent className="flex-1 min-h-0 p-0">
                <ScrollArea className="h-full">
                    {emptyState ? (
                        <EmptyState
                            variant={emptyState}
                            compact={emptyState === "no-search-results"}
                        />
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
                <NewContactWindow isOpen={isNewContactWindowOpen} onClose={() => setIsNewContactWindowOpen(false)} />
            </CardContent>
        </Card>
    )
}

export default ContactsList