import { EmptyState } from "@/components/empty-state"
import { ChatListItem } from "@/components/shared/chat-list-item"
import { SidebarPanel } from "@/components/shared/sidebar-panel"
import { useParams } from "react-router"
import { useChats } from "../hooks/use-chats-queries"
import { useChatFiltering } from "@/hooks/use-chat-filtering"
import { ChatsSkeleton } from "./chats-skeleton"
import type { Chat } from "@/types/general"

export function ChatsList() {
  const { data: chats = [], isPending } = useChats()
  const { chatId } = useParams<{ chatId: string }>()

  const {
    searchQuery,
    filteredChats,
    setSearchQuery,
  } = useChatFiltering(chats)

  return (
    <SidebarPanel
      hiddenOnMobileDetail={!!chatId}
      title="Chats"
      searchPlaceholder="Chats search..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      isLoading={isPending}
      skeleton={<ChatsSkeleton />}
    >
      {chats.length === 0 ? (
        <EmptyState variant="no-chats-list" compact />
      ) : filteredChats.length === 0 ? (
        <EmptyState variant="no-search-results" compact />
      ) : (
        <ul className="divide-y">
          {filteredChats.map((chat: Chat) => (
            <ChatListItem key={chat.id} chat={chat} variant="chats" />
          ))}
        </ul>
      )}
    </SidebarPanel>
  )
}