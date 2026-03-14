import SideNavbar from '@/components/navbar/side-navbar'
import useChannels from '@/hooks/use-channels';
import { Outlet, useLocation, useParams } from 'react-router'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

const AppLayout = () => {
  useChannels();
  const location = useLocation()
  const { chatId, contactId, groupId } = useParams()
  const isChatWindowOpen =
    chatId != null ||
    groupId != null ||
    (contactId != null && location.pathname !== "/contacts/requests")

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const update = () => {
      const el = containerRef.current
      if (!el) return
      el.style.top = `${vv.offsetTop}px`
      el.style.height = `${vv.height}px`
    }

    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed left-0 right-0 flex overflow-hidden" style={{ top: 0, height: '100dvh' }}>
      <SideNavbar />
      <div className={cn("flex-1 overflow-hidden bg-accent", !isChatWindowOpen && "pb-16 md:pb-0")}>
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout