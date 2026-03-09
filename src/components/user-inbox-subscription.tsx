import { useAuth } from "@/contexts/auth-context"
import { useMessengerInbox } from "@/contexts/messenger-inbox-context"
import { useUserInboxChannel } from "@/hooks/use-user-inbox-channel"

/**
 * Subscribes to the current user's private channel and forwards MessageCreated
 * to the messenger inbox context. Mount inside MessengerInboxProvider when
 * the user is logged in (e.g. in MessengerLayout).
 */
export function UserInboxSubscription() {
  const { user } = useAuth()
  const { onMessageReceived } = useMessengerInbox()

  useUserInboxChannel(user?.id, onMessageReceived)

  return null
}
