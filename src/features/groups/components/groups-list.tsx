import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { ChatListItem } from "@/components/shared/chat-list-item"
import { SidebarPanel } from "@/components/shared/sidebar-panel"
import { Plus } from "lucide-react"
import { useParams } from "react-router"
import { useGroups } from "../hooks/use-groups-queries"
import { useChatFiltering } from "@/hooks/use-chat-filtering"
import { GroupsSkeleton } from "./groups-skeleton"
import { CreateGroupWindow } from "./create-group-window"
import type { Chat } from "@/types/general"

export function GroupsList() {
  const { data: groups = [], isPending } = useGroups()
  const { groupId } = useParams<{ groupId: string }>()
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)

  const {
    searchQuery,
    filteredChats,
    setSearchQuery,
  } = useChatFiltering(groups)

  return (
    <>
      <SidebarPanel
        hiddenOnMobileDetail={!!groupId}
        title="Groups"
        searchPlaceholder="Groups search..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoading={isPending}
        skeleton={<GroupsSkeleton />}
        actions={
          <Button type="button" onClick={() => setIsCreateGroupOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Group
          </Button>
        }
      >
        {groups.length === 0 ? (
          <EmptyState variant="no-groups-list" compact />
        ) : filteredChats.length === 0 ? (
          <EmptyState variant="no-search-results" compact />
        ) : (
          <ul className="divide-y">
            {filteredChats.map((group: Chat) => (
              <ChatListItem key={group.id} chat={group} variant="groups" />
            ))}
          </ul>
        )}
      </SidebarPanel>

      <CreateGroupWindow
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />
    </>
  )
}