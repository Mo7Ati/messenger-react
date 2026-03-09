import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useParams } from "react-router"
import { EmptyState } from "@/components/empty-state"
import { useGroups } from "../hooks/use-groups-queries"
import { useFilteredGroups } from "../hooks/use-filtered-groups"
import { GroupsSkeleton } from "./groups-skeleton"
import { ConversationListItem } from "@/components/conversation-list-item"
import { CreateGroupWindow } from "./create-group-window"

export function GroupsList() {
  const { data: groups = [], isPending } = useGroups()
  const { groupId } = useParams<{ groupId: string }>()
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)

  const {
    searchQuery,
    filteredGroups,
    setSearchQuery,
  } = useFilteredGroups(groups)

  if (isPending) return <GroupsSkeleton />

  return (
    <Card
      className={cn(
        groupId && "hidden",
        "w-full md:w-96 h-full flex flex-col overflow-hidden rounded-none"
      )}
    >
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold">Groups</CardTitle>
          <Button type="button" onClick={() => setIsCreateGroupOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Group
          </Button>
        </div>

        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9 rounded-xl"
            placeholder="Groups search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-0">
        {groups.length === 0 ? (
          <EmptyState variant="no-groups-list" compact />
        ) : (
          <ScrollArea className="h-full">
            {filteredGroups.length === 0 ? (
              <EmptyState variant="no-search-results" compact />
            ) : (
              <ul className="divide-y">
                {filteredGroups.map((chat) => (
                  <ConversationListItem key={chat.id} chat={chat} variant="groups" />
                ))}
              </ul>
            )}
          </ScrollArea>
        )}
      </CardContent>
      <CreateGroupWindow
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />
    </Card>
  )
}
