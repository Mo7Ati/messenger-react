import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { SearchUser } from "@/services/contacts-service"
import { cn } from "@/lib/utils"

type UserSearchItemProps = {
  user: SearchUser
  onStartChat?: (user: SearchUser) => void
  onSendRequest?: (user: SearchUser) => void
  onAcceptRequest?: (user: SearchUser, requestId?: number) => void
  disabled?: boolean
  requestId?: number
}

export function UserSearchItem({
  user,
  onStartChat,
  onSendRequest,
  onAcceptRequest,
  disabled = false,
  requestId,
}: UserSearchItemProps) {
  const avatarUrl = user.avatar_url ?? user.avatar
  const status = user.contact_status ?? "none"

  const renderActionButton = () => {
    if (status === "none") {
      return (
        <Button
          size="sm"
          variant="default"
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          onClick={() => onSendRequest?.(user)}
          disabled={disabled}
        >
          Add Contact
        </Button>
      )
    }
    if (status === "request_sent") {
      return (
        <Button
          size="sm"
          variant="secondary"
          className="rounded-xl text-muted-foreground shrink-0"
          disabled
        >
          Request Sent
        </Button>
      )
    }
    if (status === "request_received") {
      return (
        <Button
          size="sm"
          variant="default"
          className="rounded-xl bg-green-600 text-white hover:bg-green-700 shrink-0"
          onClick={() => onAcceptRequest?.(user, requestId)}
          disabled={disabled}
        >
          Accept Request
        </Button>
      )
    }
    if (status === "contacts") {
      return (
        <Button
          size="sm"
          variant="default"
          className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          onClick={() => onStartChat?.(user)}
          disabled={disabled}
        >
          Message
        </Button>
      )
    }
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl",
        "hover:bg-muted/50 transition-colors"
      )}
    >
      <Avatar className="h-12 w-12 shrink-0 rounded-full">
        <AvatarImage src={avatarUrl} alt={user.name} />
        <AvatarFallback className="rounded-full text-sm">
          {user.name?.slice(0, 2).toUpperCase() ?? "?"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{user.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {user.username ? `@${user.username}` : user.email ?? ""}
        </p>
        {/* {user.bio && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {user.bio}
          </p>
        )} */}
      </div>
      <div className="shrink-0">{renderActionButton()}</div>
    </div>
  )
}
