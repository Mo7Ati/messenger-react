import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search } from "lucide-react"
import { useChats } from "../utils"
import { ChatsSkeleton } from "./chats-skeleton"
import { cn } from "@/lib/utils"
import { useParams } from "react-router"
import { EmptyState } from "@/components/empty-state"
import { useFilteredChats } from "../hooks/use-filtered-chats"
import ChatListItem from "./chat-list-item"

export function ChatsList() {
  const { data: chats = [], isPending } = useChats();
  const { chatId } = useParams<{ chatId: string }>();

  const {
    searchQuery,
    filteredChats,
    setSearchQuery,
  } = useFilteredChats(chats)


  if (isPending) return <ChatsSkeleton />;


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
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
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
      <CardContent className="flex-1 min-h-0 p-0" >
        {
          chats.length === 0 ? <EmptyState variant="no-chats-list" compact /> :
            <ScrollArea className="h-full">
              {filteredChats.length === 0 ? <EmptyState variant="no-search-results" compact /> :
                <ul className="divide-y">
                  {filteredChats.map((chat) => {
                    return (
                      <ChatListItem key={chat.id} chat={chat} />
                    )
                  })}
                </ul>
              }
            </ScrollArea>
        }
      </CardContent>
    </Card >
  )
}