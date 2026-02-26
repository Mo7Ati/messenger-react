import SideNavbar from '@/components/side-navbar'

const MessengerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen w-screen">
            <SideNavbar />
            {children}
        </div>
    )
}

export default MessengerLayout