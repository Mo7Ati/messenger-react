import SideNavbar from '@/components/side-navbar'
import { Outlet } from 'react-router'
import { MessengerInboxProvider } from '@/contexts/messenger-inbox-context'
import { TypingProvider } from '@/contexts/typing-context'
import { UserInboxSubscription } from '@/components/user-inbox-subscription'

const MessengerLayout = () => {
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

export default MessengerLayout