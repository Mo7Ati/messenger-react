import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export type UserListItemUser = {
  id: number
  name: string
  username?: string
  avatar?: string
  avatar_url?: string
  email?: string
  [key: string]: unknown
}

type UserListItemProps = {
  user: UserListItemUser
  onAction: (user: UserListItemUser) => void
  actionLabel: string
  className?: string
}

export function UserListItem({
  user,
  onAction,
  actionLabel,
  className,
}: UserListItemProps) {
  const avatarUrl = user.avatar_url ?? user.avatar

  return (
    <div
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl",
        "hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <Avatar className="h-10 w-10 shrink-0 rounded-full">
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
