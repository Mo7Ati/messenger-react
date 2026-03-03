
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Plus, Search } from "lucide-react"
import { useChats } from "../utils"
import { ChatsSkeleton } from "./chats-skeleton"
import { cn } from "@/lib/utils"
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, CheckCheck } from "lucide-react"
import { useNavigate, useParams } from "react-router"

export function ChatsList() {
  const { data: chats } = useChats();
  const navigate = useNavigate();
  const { id } = useParams<"id">();

  if (!chats) return <ChatsSkeleton />;

  return (
    <Card className={cn(
      id && "hidden",
      "w-full md:w-96 block "
    )}>
      {/* Header */}
      <CardHeader className="pb-3" >
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold">Chats</CardTitle>

          <Button
            variant="outline"
            className="rounded-xl"
            type="button"
          >
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9 rounded-xl" placeholder="Chats search..." />
        </div>
      </CardHeader>

      {/* List */}
      <CardContent className="flex-1 min-h-0 p-0 mt-7" >
        <ScrollArea className="h-full">
          <ul className="divide-y">
            {chats.map((chat) => {
              const active = chat.id === Number(id);
              return (
                <li key={chat.id} >
                  <button
                    type="button"
                    onClick={() => navigate(`/chats/${chat.id}`)}
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
        </ScrollArea>
      </ CardContent>
    </Card >
  )
}