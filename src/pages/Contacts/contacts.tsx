import { Outlet } from "react-router"
import ContactsList from "./components/contacts-list"

const Contacts = () => {
    return (
        <div className="p-5 flex h-full w-full">
            <ContactsList />
            <div className="flex-1 min-w-0 flex flex-col">
                <Outlet />
            </div>
        </div>
    )
}

export default Contacts