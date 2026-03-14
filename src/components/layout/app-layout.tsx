import SideNavbar from '@/components/navbar/side-navbar'
import useChannels from '@/hooks/use-channels';
import { Outlet, useLocation, useParams } from 'react-router'
import { cn } from '@/lib/utils'

const AppLayout = () => {
  useChannels();
  const location = useLocation()
  const { chatId, contactId, groupId } = useParams()
  const isChatWindowOpen =
    chatId != null ||
    groupId != null ||
    (contactId != null && location.pathname !== "/contacts/requests")

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <SideNavbar />
      <div className={cn("flex-1 overflow-hidden bg-accent", !isChatWindowOpen && "pb-16 md:pb-0")}>
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout