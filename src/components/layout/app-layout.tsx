import SideNavbar from '@/components/navbar/side-navbar'
import { Outlet } from 'react-router'

const AppLayout = () => {
  return (
    <div className="flex h-screen w-screen">
      <SideNavbar />
      <div className="flex-1 pb-16 md:pb-0 bg-accent">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout