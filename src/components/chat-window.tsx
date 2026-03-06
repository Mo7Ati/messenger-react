import { useEffect, useRef } from "react"
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip } from "lucide-react"
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Message, User } from "@/types/general"


type ChatWindowProps = {
  participants: User[]
  label: string
  messages: Message[]
  input: string
  isLoading?: boolean
  onBack?: () => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
}

export const ChatWindow = ({
  participants,
  label,
  messages,
  input,
  isLoading,
  onBack,
  onInputChange,
  onSend,
}: ChatWindowProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-background">
      <div className="flex items-center gap-3 px-4 py-3 border rounded-2xl bg-background">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={onBack}
          >
            <ArrowLeft size={18} />
          </Button>
        )}

        <div className="relative shrink-0">
          <AvatarGroup>
            {participants.map((participant) => (
              <Avatar key={participant.id}>
                <AvatarImage src={participant.avatar_url} alt={participant.name} />
                <AvatarFallback>{participant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>
            ))}
            {participants.length > 2 && (
              <AvatarGroupCount>{participants.length - 2}</AvatarGroupCount>
            )}
          </AvatarGroup>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{label}</p>
          <p className="text-xs text-muted-foreground truncate">{/* status here */}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Phone size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Video size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreVertical size={18} />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-0 flex-1 px-4 py-4">
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
                  "max-w-[85%] sm:max-w-[75%] md:max-w-[60%] overflow-hidden rounded-2xl px-3.5 py-2 text-sm",
                  msg.is_mine
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}
              >
                <p className="whitespace-pre-wrap wrap-anywhere">{msg.body}</p>

                <p
                  className={cn(
                    "text-[10px] mt-1 text-right whitespace-nowrap",
                    msg.is_mine ? "text-primary-foreground/70" : "text-muted-foreground"
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

      <div className="border-t px-4 py-3 bg-background">
        <div className="flex items-center gap-2  mx-auto min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground shrink-0"
          >
            <Smile size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground shrink-0"
          >
            <Paperclip size={20} />
          </Button>

          <Input
            placeholder="Type a message..."
            value={input}
            onChange={onInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
            className="flex-1 h-9 bg-muted/50 border-0 min-w-0"
          />

          <Button
            size="icon"
            className="h-9 w-9 shrink-0"
            disabled={!input.trim()}
            onClick={onSend}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}



export default ChatWindow