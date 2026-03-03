import SideNavbar from '@/components/side-navbar'

const MessengerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen">
      <SideNavbar />
      {/* Add bottom padding on mobile so content doesn't sit under the fixed bottom nav */}
      <div className="flex-1 pb-16 md:pb-0">
        {children}
      </div>
    </div>
  )
}

export default MessengerLayout