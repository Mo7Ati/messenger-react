import React, { useEffect, useState } from 'react'
import { useChat } from "../utils"
import { useLocation, useNavigate, useParams } from "react-router"
import api from "@/lib/api"
import { toast } from "sonner"
import { useConversationChannel } from "../use-conversation-channel"
import type { Message } from '@/types/general'
import ChatWindow from '../../../components/chat-window'

const ExistingChatPreview = () => {
    const { chatId } = useParams<{ chatId: string }>()
    const navigate = useNavigate()
    const { data: chat, isLoading } = useChat(Number(chatId))
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        if (chat && chat.messages) {
            setMessages(chat.messages)
        }
    }, [chat, chat?.messages])

    useConversationChannel(Number(chatId), setMessages)

    const handleSend = async () => {
        const text = input.trim()
        if (!text || !chat) return
        try {
            const { data } = await api.post<Message>("/messages", {
                conversation_id: chat.id,
                message: text,
            })
            setMessages((prev) => [...prev, data])
            setInput("")
        } catch {
            toast.error("Failed to send message")
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    if (isLoading && !chat) {
        return <div>Loading...</div>
    }

    if (!chat) {
        return <div>Chat not found</div>
    }

    return (
        <ChatWindow
            participants={chat.participants}
            label={chat.label}
            messages={messages}
            input={input}
            isLoading={false}
            onBack={() => navigate("/chats")}
            onInputChange={handleInputChange}
            onSend={handleSend}
        />
    )
}

export default ExistingChatPreview