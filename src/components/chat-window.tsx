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
import { useIsMobile } from "@/hooks/use-mobile"
import { useVisualViewportHeight } from "@/hooks/use-visual-viewport-height"
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
}

export const ChatWindow = ({
  participants,
  title,
  messages,
  input,
  isLoading,
  isSending,
  onBack,
  onInputChange,
  onSend,
}: ChatWindowProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()
  const visualHeight = useVisualViewportHeight()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [])

  const chatHeightStyle =
    isMobile && visualHeight != null
      ? { maxHeight: `${visualHeight}px` }
      : undefined

  const visibleParticipants = useMemo(() => participants.slice(0, 2), [participants])
  const extraParticipantsCount = Math.max(participants.length - 2, 0)
  const canSend = input.trim().length > 0 && !isSending

  if (isLoading) {
    return <ChatWindowSkeleton />
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden"
      style={chatHeightStyle}
    >

      {/* header */}
      <div className="flex items-center gap-3   px-4 py-3">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
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
        </div>

        <div className="shrink-0 flex items-center gap-1">
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Phone size={18} />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Video size={18} />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreVertical size={18} />
          </Button>
        </div>
      </div>

      {/* messages */}
      <ScrollArea className="h-0 flex-1 px-4 py-4">
        <div className="flex flex-col gap-2">
          {messages.length === 0 && (
            <div className="flex h-full min-h-[200px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex w-full", msg.is_mine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] overflow-hidden rounded-2xl px-4 py-2 text-sm sm:max-w-[75%] md:max-w-[60%]",
                  msg.is_mine
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-background text-foreground"
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
      </ScrollArea>

      {/* input */}
      <div className="border-t bg-background px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (canSend) onSend()
          }}
          className="mx-auto flex min-w-0 items-center gap-2"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground"
          >
            <Smile size={20} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground"
          >
            <Paperclip size={20} />
          </Button>

          <Input
            placeholder="Type a message..."
            value={input}
            onChange={onInputChange}
            onFocus={scrollToBottom}
            className="h-9 min-w-0 flex-1 border-0 bg-muted/50"
          />

          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 shrink-0"
            disabled={!canSend}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div >
  )
}

export default ChatWindow
