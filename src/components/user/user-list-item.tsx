import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { User } from "@/types/general"


type UserListItemProps = {
  user: User
  onAction: (user: User) => void
  actionLabel: string
  className?: string
}

export function UserListItem({
  user,
  onAction,
  actionLabel,
  className,
}: UserListItemProps) {
  const avatarUrl = user.avatar_url

  return (
    <div
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl",
        "hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <Avatar className="h-10 w-10 shrink-0 rounded-full">
        <AvatarImage src={avatarUrl} alt={user.username} />
        <AvatarFallback className="rounded-full text-sm">
          {user.username.slice(0, 2).toUpperCase() ?? "?"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{user.username}</p>
        <p className="text-xs text-muted-foreground truncate">
          {user.username ? `@${user.username}` : user.email ?? ""}
        </p>
      </div>
      <Button
        size="sm"
        variant="default"
        className="rounded-xl shrink-0"
        onClick={() => onAction(user)}
      >
        {actionLabel}
      </Button>
    </div>
  )
}
