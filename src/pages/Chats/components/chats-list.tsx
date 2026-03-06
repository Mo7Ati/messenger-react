
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useState, useMemo } from "react"
import { Plus, Search } from "lucide-react"
import { useChats } from "../utils"
import { ChatsSkeleton } from "./chats-skeleton"
import { cn } from "@/lib/utils"
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, CheckCheck } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { EmptyState } from "@/components/empty-state"

export function ChatsList() {
  const { data: chats, isLoading } = useChats();
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = useMemo(() => {
    if (!chats) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (chat) =>
        chat.label.toLowerCase().includes(q) ||
        chat.participants.some((p) => p.name.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q))
    );
  }, [chats, searchQuery]);

  if (isLoading) return <ChatsSkeleton />;
  if (!chats) {
    return (
      <Card className={cn(chatId && "hidden", "w-full md:w-96 h-full flex flex-col overflow-hidden")}>
        <CardHeader className="pb-3 shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">Chats</CardTitle>
            <Button variant="outline" className="rounded-xl" type="button" onClick={() => navigate("/contacts")}>
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9 rounded-xl" placeholder="Chats search..." disabled />
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-0 mt-7 flex items-center justify-center">
          <EmptyState variant="no-chats-list" compact />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      chatId && "hidden",
      "w-full md:w-96 h-full flex flex-col overflow-hidden"
    )}>
      {/* Header */}
      <CardHeader className="pb-3 shrink-0" >
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold">Chats</CardTitle>

          <Button
            variant="outline"
            className="rounded-xl"
            type="button"
            onClick={() => navigate("/chats")}
          >
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9 rounded-xl"
            placeholder="Chats search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>

      {/* List */}
      <CardContent className="flex-1 min-h-0 p-0 mt-7" >
        <ScrollArea className="h-full">
          {filteredChats.length === 0 ? (
            <EmptyState variant="no-search-results" compact />
          ) : (
          <ul className="divide-y">
            {filteredChats.map((chat) => {
              const active = chat.id === Number(chatId);
              return (
                <li key={chat.id} >
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/chats/${chat.id}`, { state: { chat } })
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
                        <AvatarGroup>
                          {chat.participants.map((participant) => (
                            <Avatar key={participant.id}>
                              <AvatarImage src={participant.avatar_url} alt={participant.name} />
                              <AvatarFallback>{participant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                              <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                            </Avatar>
                          ))}
                          {
                            chat.participants.length > 2 && (
                              <AvatarGroupCount>{chat.participants.length - 2}</AvatarGroupCount>
                            )
                          }
                        </AvatarGroup>
                        {/* {chat.online && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                        )} 
                         */}
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold">
                            {chat.label}
                          </p>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {chat.last_message.created_at}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          {chat.last_message.is_read_by_all ? (
                            <CheckCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                          ) : (
                            <Check className="h-4 w-4 shrink-0" />
                          )}
                          <span className="truncate">{chat.last_message.body.length > 20 ? chat.last_message.body.slice(0, 20) + "..." : chat.last_message.body}</span>
                        </div>
                      </div>

                      {/* Unread */}
                      {chat.new_messages > 0 && (
                        <Badge className="h-6 min-w-6 justify-center rounded-full px-2">
                          {chat.new_messages}
                        </Badge>
                      )}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}