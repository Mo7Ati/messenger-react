import { MessageCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

export type EmptyStateVariant =
  | "no-chat"
  | "no-contact"
  | "no-chats-list"
  | "no-contacts-list"
  | "no-search-results"
  | "no-group"
  | "no-groups-list"

const config: Record<
  EmptyStateVariant,
  { icon: React.ElementType; title: string; description: string; cta?: string; ctaPath?: string }
> = {
  "no-chat": {
    icon: MessageCircle,
    title: "Select a conversation",
    description: "Choose a chat from the list to start messaging.",
  },
  "no-contact": {
    icon: Users,
    title: "Select a contact",
    description: "Choose a contact to view their profile or start a conversation.",
  },
  "no-chats-list": {
    icon: MessageCircle,
    title: "No chats yet",
    description: "Start a new conversation to see your chats here.",
    cta: "Start a chat",
    ctaPath: "/contacts",
  },
  "no-contacts-list": {
    icon: Users,
    title: "No contacts found",
    description: "Your contacts will appear here when you add them.",
  },
  "no-search-results": {
    icon: Users,
    title: "No matching results",
    description: "Try a different search term.",
  },
  "no-group": {
    icon: Users,
    title: "Select a group",
    description: "Choose a group from the list to view the conversation.",
  },
  "no-groups-list": {
    icon: Users,
    title: "No groups yet",
    description: "Create or join a group to see it here.",
    cta: "New Group",
    ctaPath: "/groups",
  },
}

type EmptyStateProps = {
  variant: EmptyStateVariant
  compact?: boolean
}

export function EmptyState({ variant, compact }: EmptyStateProps) {
  const navigate = useNavigate()
  const { icon: Icon, title, description, cta, ctaPath } = config[variant]

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        {cta && ctaPath && (
          <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate(ctaPath)}>
            {cta}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      {cta && ctaPath && (
        <Button variant="outline" className="mt-4" onClick={() => navigate(ctaPath)}>
          {cta}
        </Button>
      )}
    </div>
  )
}
