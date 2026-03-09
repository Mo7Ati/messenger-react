import { useCallback, useEffect, useMemo, useRef } from "react"
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
} from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Message, User } from "@/types/general"
import { ChatWindowSkeleton } from "./ui/chat-window-skeleton"

type ChatWindowProps = {
  title: string
  participants: User[]
  messages: Message[]
  input: string
  isLoading?: boolean
  isSending?: boolean
  onBack?: () => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
  onVoiceCall?: () => void
  onVideoCall?: () => void
  onMoreClick?: () => void
  onAttachClick?: () => void
  onEmojiClick?: () => void
}

const ChatWindow = ({
  participants,
  title,
  messages,
  input,
  isLoading = false,
  isSending = false,
  onBack,
  onInputChange,
  onSend,
  onVoiceCall,
  onVideoCall,
  onMoreClick,
  onAttachClick,
  onEmojiClick,
}: ChatWindowProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const visibleParticipants = useMemo(() => participants.slice(0, 2), [participants])
  const extraParticipantsCount = Math.max(participants.length - 2, 0)
  const canSend = input.trim().length > 0 && !isSending

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({
      behavior,
      block: "end",
    })
  }, [])

  useEffect(() => {
    scrollToBottom("smooth")
  }, [messages.length, scrollToBottom])

  if (isLoading) {
    return <ChatWindowSkeleton />
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 md:hidden"
            onClick={onBack}
          >
            <ArrowLeft size={18} />
          </Button>
        )}

        <div className="shrink-0">
          <AvatarGroup>
            {visibleParticipants.map((participant) => (
              <Avatar key={participant.id}>
                <AvatarImage src={participant.avatar_url} alt={participant.name} />
                <AvatarFallback>
                  {participant.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>
            ))}

            {extraParticipantsCount > 0 && (
              <AvatarGroupCount>+{extraParticipantsCount}</AvatarGroupCount>
            )}
          </AvatarGroup>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {participants.length === 1
              ? "Online"
              : `${participants.length} participants`}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={onVoiceCall}
          >
            <Phone size={18} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={onVideoCall}
          >
            <Video size={18} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={onMoreClick}
          >
            <MoreVertical size={18} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex min-h-full flex-col px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    msg.is_mine ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "min-w-0 max-w-[85%] overflow-hidden rounded-2xl px-4 py-2 text-sm shadow-sm sm:max-w-[75%] md:max-w-[60%]",
                      msg.is_mine
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-accent text-foreground"
                    )}
                  >
                    <p className="whitespace-pre-wrap break-all">{msg.body}</p>

                    <p
                      className={cn(
                        "mt-1 whitespace-nowrap text-right text-[10px]",
                        msg.is_mine
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {msg.created_at}
                    </p>
                  </div>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="shrink-0 border-t bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (canSend) onSend()
          }}
          className="flex min-w-0 items-center gap-2"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground"
            onClick={onEmojiClick}
          >
            <Smile size={20} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground"
            onClick={onAttachClick}
          >
            <Paperclip size={20} />
          </Button>

          <Input
            placeholder="Type a message..."
            value={input}
            onChange={onInputChange}
            onFocus={() => scrollToBottom("smooth")}
            className="h-10 min-w-0 flex-1 border-0 bg-muted/50 shadow-none focus-visible:ring-1"
          />

          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0"
            disabled={!canSend}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatWindow