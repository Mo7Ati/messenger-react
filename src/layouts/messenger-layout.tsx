import SideNavbar from '@/components/side-navbar'
import { Outlet, useLocation, useParams } from 'react-router'
import { MessengerInboxProvider } from '@/contexts/messenger-inbox-context'
import { UserInboxSubscription } from '@/components/user-inbox-subscription'
import { cn } from '@/lib/utils'

const MessengerLayout = () => {
  const { chatId, contactId, groupId } = useParams()
  const location = useLocation()

  // Same logic as SideNavbar — bottom nav slides away when a conversation is open
  const isChatWindowOpen =
    chatId != null ||
    groupId != null ||
    (contactId != null && location.pathname !== "/contacts/requests")

  return (
    <MessengerInboxProvider>
      <UserInboxSubscription />
      <div className="flex h-screen w-screen overflow-hidden">
        <SideNavbar />
        {/*
          On mobile: add pb-16 only when the bottom nav is visible.
          When a chat is open the nav slides off-screen, so we reclaim that space.
        */}
        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden bg-accent",
            isChatWindowOpen ? "pb-0" : "pb-16 md:pb-0"
          )}
        >
          <Outlet />
        </div>
      </div>
    </MessengerInboxProvider>
  )
}

export default MessengerLayout