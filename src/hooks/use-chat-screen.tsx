import { useParams } from 'react-router'
import { useChat } from './use-chats-queries'
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Message } from '@/types/general';
import { toast } from 'sonner';
import useUpdateCache from './use-update-cache';
import useChannels from './use-channels';
import { useUser } from '@/features/auth/auth-context';

const useChatScreen = () => {
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false)
    const { syncMessage, makeAsRead } = useUpdateCache()
    const { messengerChannel } = useChannels()
    const user = useUser()

    const { chatId } = useParams<{ chatId: string }>()
    const numericChatId = Number(chatId)
    const { data: chat, isFetching } = useChat(numericChatId, !!numericChatId)

    const whisperRead = (chatId: number) => {
        messengerChannel().whisper("read", {
            chat_id: chatId,
            user_id: user.id,
        })
    }

    useEffect(() => {
        if (isFetching || !numericChatId || !chat || chat.new_messages === 0) return
        makeAsRead(numericChatId)
        whisperRead(numericChatId)
    }, [numericChatId, isFetching])

    const handleSend = async ({ body, files }: { body: string, files: File[] }) => {
        try {
            setIsSending(true)

            const formData = new FormData()
            formData.append("chat_id", chatId!)

            if (body) {
                formData.append("message", body)
            }

            files.forEach((file) => {
                formData.append("attachments[]", file)
            })

            const { data: sentMessage } = await api.post<Message>(`/messages`, formData)

            syncMessage(sentMessage)

        } catch (error) {
            toast.error("Failed to send message. Please try again.")
        } finally {
            setIsSending(false)
        }
    }


    const handleInputFocus = () => {
        if (numericChatId && chat && chat.new_messages > 0) {
            makeAsRead(numericChatId)
            whisperRead(numericChatId)
        }
    }

    return {
        chatId: numericChatId,
        newMessages: chat?.new_messages ?? 0,
        participants: chat?.participants ?? [],
        title: chat?.label ?? "Chat",
        messages: chat?.messages ?? [],
        typingLabel: chat?.typing_label ?? "",
        input,
        chatType: chat?.type ?? "peer",
        isFetching,
        isSending,
        setInput,
        handleSend,
        handleInputFocus,
    }
}

export default useChatScreen