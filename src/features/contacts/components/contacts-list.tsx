import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { SidebarPanel } from "@/components/shared/sidebar-panel"
import { cn } from "@/lib/utils"
import { MoreVertical, Plus, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { useContacts } from "../hooks/use-contacts-queries"
import { useFilteredContacts } from "../hooks/use-filtered-contacts"
import { ContactsSkeleton } from "./contacts-skeleton"
import { NewContactWindow } from "./new-contact-window"

const ContactsList = () => {
    const { contactId } = useParams<{ contactId: string }>()
    const {
        data: response = {
            data: [],
            extra: { pending_requests: 0 },
        },
        isFetching,
        isError,
    } = useContacts()

    const [isNewContactWindowOpen, setIsNewContactWindowOpen] = useState(false)
    const navigate = useNavigate()

    const {
        searchQuery,
        groupedContacts,
        emptyState,
        setSearchQuery,
    } = useFilteredContacts(response.data)

    if (isError) {
        toast.error("Failed to load contacts")
        return null
    }

    return (
        <>
            <SidebarPanel
                hiddenOnMobileDetail={!!contactId}
                title="Contacts"
                searchPlaceholder="Contacts search..."
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                isLoading={isFetching}
                skeleton={<ContactsSkeleton />}
                actions={
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <Button variant="ghost" size="sm" className="rounded-xl shrink-0" asChild>
                            <Link to="/contacts/requests" className="flex items-center gap-1.5">
                                <UserPlus className="h-4 w-4 shrink-0" />
                                <span>Requests</span>
                                {Number((response.extra as any)?.pending_requests ?? 0) > 0 && (
                                    <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                                        {Number((response.extra as any)?.pending_requests ?? 0)}
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
                            <Plus className="mr-1.5 h-4 w-4" />
                            New Contact
                        </Button>
                    </div>
                }
            >
                {emptyState ? (
                    <EmptyState
                        variant={emptyState}
                        compact={emptyState === "no-search-results"}
                    />
                ) : (
                    <div className="pb-4">
                        {groupedContacts.map(([letter, contactsForLetter]) => (
                            <div key={letter} className="mb-4">
                                <p className="mb-1 px-4 text-xs font-semibold text-primary">
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
                                                "flex w-full cursor-pointer items-start justify-between gap-3 px-4 py-2 text-left",
                                                "outline-none hover:bg-muted/50 focus-visible:bg-muted/60",
                                                active && "bg-muted"
                                            )}
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold">
                                                    {contact.username}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {contact.bio}
                                                </p>
                                            </div>

                                            <MoreVertical className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                                        </button>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </SidebarPanel>

            <NewContactWindow
                isOpen={isNewContactWindowOpen}
                onClose={() => setIsNewContactWindowOpen(false)}
            />
        </>
    )
}

export default ContactsList