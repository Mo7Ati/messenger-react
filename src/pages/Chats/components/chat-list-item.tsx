import { Avatar, AvatarBadge, AvatarFallback, AvatarGroupCount, AvatarImage } from '@/components/ui/avatar'
import { AvatarGroup } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Chat } from '@/types/general'
import { Check, CheckCheck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'

const ChatListItem = ({ chat }: { chat: Chat }) => {
    const navigate = useNavigate()
    const { chatId } = useParams<{ chatId: string }>();

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
                    Number(chatId) === chat.id && "bg-muted"
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
}

export default ChatListItem