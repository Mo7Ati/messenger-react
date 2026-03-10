import SideNavbar from '@/components/layout/side-navbar'
import { Outlet } from 'react-router'
import { MessengerInboxProvider } from '@/features/messaging/messenger-inbox-context'
import { TypingProvider } from '@/features/messaging/typing-context'
import { UserInboxSubscription } from '@/features/messaging/user-inbox-subscription'

const AppLayout = () => {
  return (
    <MessengerInboxProvider>
      <TypingProvider>
        <UserInboxSubscription />
        <div className="flex h-screen w-screen">
          <SideNavbar />
          <div className="flex-1 pb-16 md:pb-0 bg-accent">
            <Outlet />
          </div>
        </div>
      </TypingProvider>
    </MessengerInboxProvider>
  )
}

export default AppLayout