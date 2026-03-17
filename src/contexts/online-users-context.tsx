import { createContext, useContext, useState } from "react"
import type { Dispatch, ReactNode, SetStateAction } from "react"

type OnlineUsersContextValue = {
    onlineUserIds: Set<number>
    setOnlineUserIds: Dispatch<SetStateAction<Set<number>>>
}

const OnlineUsersContext = createContext<OnlineUsersContextValue>({
    onlineUserIds: new Set(),
    setOnlineUserIds: () => {},
})

export function OnlineUsersProvider({ children }: { children: ReactNode }) {
    const [onlineUserIds, setOnlineUserIds] = useState<Set<number>>(new Set())

    return (
        <OnlineUsersContext.Provider value={{ onlineUserIds, setOnlineUserIds }}>
            {children}
        </OnlineUsersContext.Provider>
    )
}

export function useOnlineUsers() {
    return useContext(OnlineUsersContext)
}
