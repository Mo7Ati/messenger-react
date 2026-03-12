import { useNavigate, useParams } from 'react-router'
import { useState } from 'react';
import api from '@/lib/api';
import type { Chat, Message } from '@/types/general';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useGroup } from './use-groups-queries';

const useChatScreen = () => {
    const { groupId } = useParams<{ groupId: string }>()
    const [isSending, setIsSending] = useState(false)
    const queryClient = useQueryClient();

    const { data: group, isFetching } = useGroup(Number(groupId))
    const navigate = useNavigate()

    const onBack = () => navigate("/groups");

    const handleSend = async ({ body, files }: { body: string, files: File[] }) => {
        try {
            setIsSending(true)

            const formData = new FormData()
            formData.append("chat_id", groupId!)

            if (body) {
                formData.append("message", body)
            }

            files.forEach((file) => {
                formData.append("attachments[]", file)
            })

            const { data: sentMessage } = await api.post<Message>(`/messages`, formData, {
                headers: {
                    "Content-Type": files.length > 0 ? "multipart/form-data" : "application/json",
                },
            })


            queryClient.setQueryData<Chat>(["group", Number(groupId)], (group) => {
                if (!group) return group

                return {
                    ...group,
                    messages: [...group.messages, sentMessage],
                    last_message: sentMessage,
                }
            })

            queryClient.setQueryData<Chat[]>(["groups"], (groups) => {
                if (!groups) return groups
                return groups.map((g) => {
                    if (g.id === sentMessage.chat_id) {
                        return {
                            ...g,
                            last_message: sentMessage,
                        }
                    }
                    return g
                })
            })
        } catch (error) {
            toast.error("Failed to send message. Please try again.")
        } finally {
            setIsSending(false)
        }
    }


    return {
        participants: group?.participants ?? [],
        title: group?.label ?? "Group",
        messages: group?.messages ?? [],
        isFetching,
        isSending,
        onBack,
        handleSend,
    }
}

export default useChatScreen