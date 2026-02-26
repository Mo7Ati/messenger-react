import MessengerLayout from "@/layouts/messenger-layout"
import { lazy, Suspense, useState } from "react"
import ChatWindow from "./componenets/chat-window"

import { cn } from "@/lib/utils"
import ChatsCard from "./componenets/chats-card"

const Chats = () => {
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null)

    const handleBackToChats = () => {
        setSelectedChatId(null)
    }

    return (
        <MessengerLayout>
            <div className="flex flex-1 overflow-hidden p-4 gap-4">
                {/* Chats List */}
                <div className={cn('flex min-h-0 w-full max-w-sm flex-col', selectedChatId !== null ? "hidden md:flex" : "flex")}>
                        <ChatsCard
                            selectedChatId={selectedChatId}
                            setSelectedChatId={setSelectedChatId}
                        />
                    {/* <Suspense fallback={<div>Loading...</div>}>
                    </Suspense> */}
                </div>

                {/* Chat Window */}
                <div className={cn('min-h-0 flex-1', selectedChatId === null ? "hidden md:flex" : "flex")}>
                    <ChatWindow
                        selectedChatId={selectedChatId}
                        onBack={handleBackToChats}
                    />
                </div>

            </div>
        </MessengerLayout>
    )
}

export default Chats