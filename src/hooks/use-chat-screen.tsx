import { useNavigate, useParams } from 'react-router'
import { useChat } from './use-chats-queries'
import { useState } from 'react';
import api from '@/lib/api';
import type { Chat, Message } from '@/types/general';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const useChatScreen = () => {
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false)
    const queryClient = useQueryClient();

    const { chatId } = useParams<{ chatId: string }>()
    const { data: chat, isFetching } = useChat(Number(chatId), !!chatId)

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


            queryClient.setQueryData<Chat>(["chat", Number(chatId)], (chat) => {
                if (!chat) return chat

                return {
                    ...chat,
                    messages: [...(chat.messages ?? []), sentMessage],
                    last_message: sentMessage,
                }
            })

            queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
                if (!chats) return chats
                return chats.map((c) => {
                    if (c.id === sentMessage.chat_id) {
                        return {
                            ...c,
                            last_message: sentMessage,
                        }
                    }
                    return c
                })
            })
        } catch (error) {
            toast.error("Failed to send message. Please try again.")
        } finally {
            setIsSending(false)
        }
    }


    return {
        participants: chat?.participants ?? [],
        title: chat?.label ?? "Chat",
        messages: chat?.messages ?? [],
        input,
        isFetching,
        isSending,
        setInput,
        handleSend,
    }
}

export default useChatScreen