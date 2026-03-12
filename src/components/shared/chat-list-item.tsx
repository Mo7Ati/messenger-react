import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Chat, Message } from "@/types/general"
import { Check, CheckCheck, FileText } from "lucide-react"
import { useNavigate, useParams } from "react-router"

export type ConversationListVariant = "chats" | "groups"

const formatLastMessageLabel = (lastMessage: Message): React.ReactNode | string => {
  if (lastMessage.type == "text") {
    return lastMessage.body.length > 20
      ? lastMessage.body.slice(0, 30) + "..."
      : lastMessage.body
  }
  return (
    <div className="flex items-center gap-1">
      <FileText size={14} className="shrink-0" />
      <span className="truncate max-w-[180px]">
        Attachment
      </span>
    </div>
  )
}


const variantConfig: Record<
  ConversationListVariant,
  { path: string; paramKey: "chatId"}
> = {
  chats: { path: "/chats", paramKey: "chatId" },
  groups: { path: "/groups", paramKey: "chatId" },
}

type ConversationListItemProps = {
  chat: Chat
  variant: ConversationListVariant
}


export function ChatListItem({ chat, variant }: ConversationListItemProps) {
  const navigate = useNavigate()
  const params = useParams<{ chatId?: string }>()
  const { path, paramKey } = variantConfig[variant]
  const activeId = params[paramKey]

  return (
    <li key={chat.id}>
      <button
        type="button"
        onClick={() => navigate(`${path}/${chat.id}`, { state: { chat } })}
        className={cn(
          "w-full px-4 py-3 text-left transition-colors cursor-pointer",
          "hover:bg-muted/50 focus-visible:bg-muted/60 outline-none",
          Number(activeId) === chat.id && "bg-muted"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <AvatarGroup>
              {chat.participants.slice(0, 2).map((participant) => (
                <Avatar key={participant.id}>
                  <AvatarImage src={participant.avatar_url} alt={participant.username} />
                  <AvatarFallback>
                    {participant.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                  <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                </Avatar>
              ))}

              {chat.participants.length > 2 && (
                <AvatarGroupCount>+{chat.participants.length - 2}</AvatarGroupCount>
              )}
            </AvatarGroup>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold">{chat.label}</p>
              {chat.last_message && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {chat.last_message.created_at}
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center justify-between gap-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 min-w-0">
                {chat.last_message ? (
                  <>
                    {chat.last_message.is_read_by_all ? (
                      <CheckCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                    <span className="truncate">
                      {
                        formatLastMessageLabel(chat.last_message)
                      }
                    </span>
                  </>
                ) : (
                  <span className="truncate">No messages yet</span>
                )}
              </div>
              <div>
                {chat.new_messages > 0 && (
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                    {chat.new_messages}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </button>
    </li>
  )
}
