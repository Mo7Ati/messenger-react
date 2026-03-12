import { useParams } from 'react-router'
import { useChat } from './use-chats-queries'
import { useState } from 'react';
import api from '@/lib/api';
import type { Message } from '@/types/general';
import { toast } from 'sonner';
import useUpdateCache from './use-update-cache';

const useChatScreen = () => {
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false)
    const { syncMessage } = useUpdateCache()

    const { chatId } = useParams<{ chatId: string }>()
    const numericChatId = Number(chatId)
    const { data: chat, isFetching } = useChat(numericChatId , !!numericChatId)

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
            // queryClient.setQueryData<Chat>(["chat", Number(chatId)], (chat) => {
            //     if (!chat) return chat

            //     return {
            //         ...chat,
            //         messages: [...(chat.messages ?? []), sentMessage],
            //         last_message: sentMessage,
            //     }
            // })

            // queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
            //     if (!chats) return chats
            //     return chats.map((c) => {
            //         if (c.id === sentMessage.chat_id) {
            //             return {
            //                 ...c,
            //                 last_message: sentMessage,
            //             }
            //         }
            //         return c
            //     })
            // })
        } catch (error) {
            toast.error("Failed to send message. Please try again.")
        } finally {
            setIsSending(false)
        }
    }


    return {
        chatId: numericChatId,
        participants: chat?.participants ?? [],
        title: chat?.label ?? "Chat",
        messages: chat?.messages ?? [],
        typingLabel: chat?.typing_label ?? "",
        input,
        isFetching,
        isSending,
        setInput,
        handleSend,
    }
}

export default useChatScreen