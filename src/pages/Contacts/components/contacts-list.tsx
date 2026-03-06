
import { useContacts } from '../utils'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate, useParams } from "react-router"

const ContactsList = () => {
    const { contactId } = useParams<{ contactId: string }>()
    const { data: contacts, isLoading } = useContacts()
    const navigate = useNavigate()

    if (isLoading) return <div>Loading contacts...</div>
    if (!contacts) return <div>No contacts found</div>

    return (
        <Card className={cn(
            contactId && "hidden",
            "w-full md:w-96 block "
        )}>
            {/* Header */}
            <CardHeader className="pb-3" >
                <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-semibold">Contacts</CardTitle>

                    <Button
                        variant="outline"
                        className="rounded-xl"
                        type="button"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Contact
                    </Button>
                </div>

                {/* Search */}
                <div className="relative mt-3">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9 rounded-xl" placeholder="Contacts search..." />
                </div>
            </CardHeader>

            {/* List */}
            <CardContent className="flex-1 min-h-0 p-0 mt-7" >
                <ScrollArea className="h-full">
                    <ul className="divide-y">
                        {contacts.map((contact) => {
                            const active = contact.id === Number(contactId);
                            return (
                                <li key={contact.id} >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate(`/contacts/${contact.id}`, { state: { contact } })
                                        }}
                                        className={cn(
                                            "w-full px-4 py-3 text-left transition-colors cursor-pointer",
                                            "hover:bg-muted/50 focus-visible:bg-muted/60 outline-none",
                                            active && "bg-muted"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className="relative shrink-0">
                                                <Avatar>
                                                    <AvatarImage src={contact.avatar_url} alt={contact.name} />
                                                    <AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                                                </Avatar>
                                                {/* {chat.online && (
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                              )} 
                               */}
                                            </div>

                                            {/* Text */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="truncate text-sm font-semibold">
                                                        {contact.name}
                                                    </p>
                                                    <span className="shrink-0 text-xs text-muted-foreground">
                                                        {contact.last_active_at}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </ScrollArea>
            </ CardContent>
        </Card >
    )
}

export default ContactsList