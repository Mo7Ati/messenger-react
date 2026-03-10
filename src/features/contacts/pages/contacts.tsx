import { Outlet, useMatch, useParams } from "react-router"
import ContactsList from "../components/contacts-list"
import { useIsMobile } from "@/hooks/use-mobile"

const Contacts = () => {
  const isMobile = useIsMobile()
  const { contactId } = useParams<{ contactId: string }>()
  const isRequestsRoute = useMatch("/contacts/requests")

  return (
    <div className="flex h-full w-full md:p-10">
      {isMobile ? (
        contactId || isRequestsRoute ? (
          <div className="flex-1 min-w-0 flex flex-col">
            <Outlet />
          </div>
        ) : (
          <ContactsList />
        )
      ) : (
        <>
          <ContactsList />
          <div className="flex-1 min-w-0 p-1 flex flex-col min-h-0">
            <Outlet />
          </div>
        </>
      )}
    </div>
  )
}

export default Contacts