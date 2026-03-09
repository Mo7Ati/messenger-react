import SideNavbar from '@/components/side-navbar'
import { Outlet } from 'react-router'
import { MessengerInboxProvider } from '@/contexts/messenger-inbox-context'
import { UserInboxSubscription } from '@/components/user-inbox-subscription'

const MessengerLayout = () => {
  return (
    <MessengerInboxProvider>
      <UserInboxSubscription />
      <div className="flex h-screen w-screen">
        <SideNavbar />
        {/* Add bottom padding on mobile so content doesn't sit under the fixed bottom nav */}
        <div className="flex-1 pb-16 md:pb-0 bg-accent">
          <Outlet />
        </div>
      </div>
    </MessengerInboxProvider>
  )
}

export default MessengerLayout