import { Outlet, useParams } from "react-router"
import { useIsMobile } from "@/hooks/use-mobile"
import { GroupsList } from "../components/groups-list"

const Groups = () => {
  const isMobile = useIsMobile()
  const { groupId } = useParams<{ groupId: string }>()

  return (
    <div className="flex h-full w-full space-x-6 md:p-10">
      {isMobile ? (
        groupId ? (
          <div className="flex-1 min-w-0 flex flex-col">
            <Outlet />
          </div>
        ) : (
          <GroupsList />
        )
      ) : (
        <>
          <GroupsList />
          <div className="flex-1 min-w-0 p-1 flex flex-col min-h-0">
            <Outlet />
          </div>
        </>
      )}
    </div>
  )
}

export default Groups
