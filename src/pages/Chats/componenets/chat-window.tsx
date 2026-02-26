import { ArrowLeft, Send } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import notSelectedChat from "../../../assets/not-selected-chat.svg"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type Message = {
  id: string
  text: string
  isOwn: boolean
  time: string
}

interface ChatWindowProps {
  selectedChatId: number | null
  chatName?: string
  onBack?: () => void
}

const formatTime = (date: Date) =>
  date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })

const seedMessagesForChat = (chatId: number): Message[] => {
  const now = new Date()
  return [
    {
      id: `m-${chatId}-1`,
      text: "Hey, how are you?",
      isOwn: false,
      time: formatTime(new Date(now.getTime() - 3600000)),
    },
    {
      id: `m-${chatId}-2`,
      text: "I'm good, thanks! What about you?",
      isOwn: true,
      time: formatTime(new Date(now.getTime() - 3500000)),
    },
    {
      id: `m-${chatId}-3`,
      text: "Doing great. Want to catch up later?",
      isOwn: false,
      time: formatTime(new Date(now.getTime() - 3400000)),
    },
    {
      id: `m-${chatId}-4`,
      text: "Sure, let's do it. Same place as last time?",
      isOwn: true,
      time: formatTime(now),
    },
  ]
}

const ChatWindow = ({ selectedChatId, chatName, onBack }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  // Seed or reset messages when chat changes
  useEffect(() => {
    if (selectedChatId !== null) {
      setMessages(seedMessagesForChat(selectedChatId))
      setInputValue("")
    }
  }, [selectedChatId])

  // Scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    const trimmed = inputValue.trim()
    if (!trimmed || selectedChatId === null) return
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${selectedChatId}-${Date.now()}`,
        text: trimmed,
        isOwn: true,
        time: formatTime(new Date()),
      },
    ])
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!selectedChatId) {
    return (
      <div className="hidden h-full w-full items-center justify-center md:flex">
        <img
          src={notSelectedChat}
          alt="No chat selected"
          className="w-full max-w-xs"
        />
      </div>
    )
  }

  const displayName = chatName ?? `Chat ${selectedChatId}`

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b px-4 py-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full border bg-background p-2 md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to chats</span>
          </button>
        )}
        <h2 className="text-sm font-medium">{displayName}</h2>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-2 p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                msg.isOwn ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                  msg.isOwn
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}
              >
                <p className="whitespace-pre-wrap wrap-break-word">{msg.text}</p>
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    msg.isOwn ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      {/* Compose */}
      <div className="shrink-0 border-t p-3">
        <div className="flex gap-2 items-end">
          <Textarea
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-10 max-h-32 resize-none py-2.5"
            rows={1}
          />
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="shrink-0 h-10 w-10 rounded-xl"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
