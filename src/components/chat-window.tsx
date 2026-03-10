import { useCallback, useEffect, useMemo, useRef } from "react"
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
  X,
  FileText,
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
import { cn, formatFileSize, formatTypingHeader, getParticipantNameColor } from "@/lib/utils"
import type { Message, User } from "@/types/general"
import { ChatWindowSkeleton } from "./ui/chat-window-skeleton"
import { useChatAttachments } from "@/features/messaging/hooks/use-chat-attachments"
import MessageAttachment from "./attachment-message"

type ChatWindowProps = {
  title: string
  participants: User[]
  isGroupChat?: boolean
  messages: Message[]
  input: string
  isLoading?: boolean
  isSending?: boolean
  typingUsers?: User[]
  onBack?: () => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: (files?: File[]) => Promise<void>
}

export const ChatWindow = ({
  participants,
  title,
  isGroupChat = false,
  messages,
  input,
  isLoading,
  isSending,
  typingUsers = [],
  onBack,
  onInputChange,
  onSend,
}: ChatWindowProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isMobile = useIsMobile()
  const visualRect = useVisualViewportHeight()

  const {
    selectedFiles,
    getPreviewUrl,
    handleFileSelect,
    removeFile,
    handleSubmit,
    handleDrop,
    handleDragOver,
  } = useChatAttachments({ input, isSending: isSending ?? false, onSend })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [])

  // On mobile: fix chat to the visual viewport so it doesn't scroll away when keyboard opens
  const chatContainerStyle =
    isMobile && visualRect != null
      ? {
        position: "fixed" as const,
        top: visualRect.offsetTop,
        left: visualRect.offsetLeft,
        width: visualRect.width,
        height: visualRect.height,
        zIndex: 10,
      }
      : undefined

  const visibleParticipants = useMemo(() => participants.slice(0, 2), [participants])
  const extraParticipantsCount = Math.max(participants.length - 2, 0)
  const canSend = (input.trim().length > 0 || selectedFiles.length > 0) && !isSending

  if (isLoading) {
    return <ChatWindowSkeleton />
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden bg-background"
      style={chatContainerStyle}
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
                <AvatarImage src={participant.avatar_url} alt={participant.username} />
                <AvatarFallback>
                  {participant.username.slice(0, 2).toUpperCase()}
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
          {typingUsers.length > 0 && (
            <p className="truncate text-xs text-muted-foreground italic">
              {participants.length > 1
                ? formatTypingHeader(typingUsers)
                : "typing..."}
            </p>
          )}
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
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">
        <div className="flex flex-col gap-2">
          {messages.length === 0 && (
            <div className="flex h-full min-h-[200px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation.
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const showGroupLayout = isGroupChat && !msg.is_mine
            const sender = msg.user

            return (
              <div
                key={msg.id}
                className={cn("flex w-full", msg.is_mine ? "justify-end" : "justify-start")}
              >
                {showGroupLayout && (
                  <div className="flex shrink-0 pt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={sender?.avatar_url} alt={sender?.username} />
                      <AvatarFallback className="text-xs bg-muted">
                        {sender?.username ? String(sender.username).slice(0, 1) : "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div
                  className={cn(
                    "min-w-0 max-w-[85%] rounded-2xl px-4 py-2 text-sm sm:max-w-[75%] md:max-w-[60%]",
                    showGroupLayout && "ml-2 relative before:content-[''] before:absolute before:left-[-6px] before:bottom-2 before:w-0 before:h-0 before:border-[6px] before:border-solid before:border-r-accent before:border-t-transparent before:border-b-transparent before:border-l-transparent dark:before:border-r-accent",
                    msg.is_mine
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-accent text-foreground"
                  )}
                >
                  {showGroupLayout && sender?.username && (
                    <p
                      className={cn(
                        "font-semibold text-sm mb-1",
                        getParticipantNameColor(sender?.id ?? 0)
                      )}
                    >
                      {sender.username}
                    </p>
                  )}
                  {(msg.type === "attachment" && msg.attachments && msg.attachments.length > 0) ? (
                    <>
                      {msg.body ? (
                        <p className="whitespace-pre-wrap wrap-anywhere">{msg.body}</p>
                      ) : null}
                      <MessageAttachment
                        key={msg.id}
                        attachments={msg.attachments}
                      />
                    </>
                  ) : (
                    <p className="whitespace-pre-wrap wrap-anywhere">{msg.body}</p>
                  )}

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
            )
          })}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* input */}
      <div className="border-t bg-background px-4 py-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/zip,audio/mpeg,video/mp4,audio/wav"
          className="hidden"
          onChange={handleFileSelect}
        />
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedFiles.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center gap-1.5 rounded-lg border bg-muted/50 px-2 py-1.5 text-xs"
              >
                {file.type.startsWith("image/") && getPreviewUrl(file) ? (
                  <img
                    src={getPreviewUrl(file)!}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded object-cover"
                  />
                ) : (
                  <FileText size={14} className="shrink-0 text-muted-foreground" />
                )}
                <span className="max-w-[120px] truncate">{file.name}</span>
                <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0"
                  onClick={() => removeFile(i)}
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (canSend) void handleSubmit()
          }}
          className="mx-auto flex min-w-0 items-center gap-2"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
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
            onClick={() => fileInputRef.current?.click()}
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
