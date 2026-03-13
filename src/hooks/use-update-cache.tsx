import type { GetContactResponse, ContactRequest, ContactRequestStatus } from "@/types/contacts"
import type { Chat, ChatType, Message, TypingUser } from "@/types/general"
import { useUser } from "@/features/auth/auth-context"
import { useQueryClient } from "@tanstack/react-query"
import type { ApiSuccessResponse } from "@/lib/api"


type TypingWhisperPayload = {
    chat_id: number
    user_id: number
    user_name: string
}

const TYPING_TIMEOUT_MS = 5000

function buildTypingLabel(
    typingUsers: Record<number, TypingUser>,
    chatType: ChatType
): string {
    const names = Object.values(typingUsers).map((u) => u.name)
    if (names.length === 0) return ""

    // Peer chat: just show generic typing indicator
    if (chatType === "peer") {
        return "typing..."
    }

    // Group chat: show at most two participant names, plus remaining count
    const [first, second] = names
    const remaining = names.length - 2

    if (!second) {
        return `${first} is typing...`
    }

    if (remaining <= 0) {
        return `${first} and ${second} are typing...`
    }

    return `${first}, ${second} and ${remaining} others are typing...`
}

function pruneStaleTyping(
    typingUsers: Record<number, TypingUser>,
    now: number
): Record<number, TypingUser> {
    return Object.fromEntries(
        Object.entries(typingUsers).filter(
            ([, value]) => now - value.lastTypingAt < TYPING_TIMEOUT_MS
        )
    ) as Record<number, TypingUser>
}

const useUpdateCache = () => {
    const queryClient = useQueryClient()
    const user = useUser()

    function syncMessage(message: Message, contactId?: number) {
        queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
            if (!chats) return chats

            if (chats.length === 0) {
                return [
                    {
                        id: message.chat_id,
                        label: message.user.username,
                        last_message: message,
                        new_messages: 1,
                        created_at: message.created_at,
                        participants: [message.user],
                        messages: [message],
                        type: "peer",
                        typing_label: "",
                        typing_users: {},
                    }
                ]
            }


            const chatExists = chats.some((c) => c.id === message.chat_id)
            if (!chatExists) {
                return [
                    {
                        id: message.chat_id,
                        label: message.user.username,
                        last_message: message,
                        new_messages: 1,
                        created_at: message.created_at,
                        participants: [message.user],
                        messages: [message],
                        type: "peer",
                        typing_label: "",
                        typing_users: {},
                    }
                ]
            }


            return chats.map((c) => {
                if (c.id === message.chat_id) {
                    return {
                        ...c,
                        last_message: message,
                        new_messages: message.is_mine ? 0 : c.new_messages + 1,
                    }
                }
                return c
            })
        })

        queryClient.setQueryData<Chat>(["chat", message.chat_id], (chat) => {
            if (!chat) return chat

            const exists = chat.messages.some((m) => m.id === message.id)
            return exists
                ? chat
                : {
                    ...chat,
                    messages: [...chat.messages, message],
                }
        })

        queryClient.setQueryData<GetContactResponse>(
            ["contact", contactId ?? message.user_id],
            (response) => {
                if (!response) return response
                if (!response.chat) return {
                    ...response,
                    chat: {
                        id: message.chat_id,
                        label: message.user.username,
                        last_message: message,
                        new_messages: 1,
                        created_at: message.created_at,
                        participants: [message.user],
                        type: "peer",
                        messages: [message],
                        typing_label: "",
                        typing_users: {},
                    },
                }

                const chat = response.chat
                const exists = chat.messages.some((m) => m.id === message.id)

                return exists
                    ? response
                    : {
                        ...response,
                        chat: {
                            ...chat,
                            messages: [...chat.messages, message],
                        },
                    }
            }
        )
    }

    function appendGroupToGroupsList(group: Chat) {
        console.log("appendGroupToGroupsList", group);
        queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
            if (!chats) return chats
            return [...chats, group]
        })
    }

    function applyTypingToChat(
        chat: Chat,
        payload: TypingWhisperPayload,
        now: number,
        isTyping: boolean
    ): Chat {
        const existing = chat.typing_users ?? {}
        let next: Record<number, TypingUser>
        if (isTyping) {
            next = {
                ...existing,
                [payload.user_id]: { name: payload.user_name, lastTypingAt: now },
            }
        } else {
            const { [payload.user_id]: _, ...rest } = existing
            next = rest
        }
        const pruned = pruneStaleTyping(next, now)
        const typing_label = buildTypingLabel(pruned, chat.type)
        return { ...chat, typing_users: pruned, typing_label }
    }

    function syncTyping(payload: TypingWhisperPayload) {
        if (payload.user_id === user.id) return
        const now = Date.now()

        queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
            if (!chats) return chats
            return chats.map((c) =>
                c.id === payload.chat_id ? applyTypingToChat(c, payload, now, true) : c
            )
        })

        queryClient.setQueryData<Chat>(["chat", payload.chat_id], (chat) => {
            if (!chat) return chat
            return applyTypingToChat(chat, payload, now, true)
        })

        queryClient.setQueryData<GetContactResponse>(
            ["contact", payload.user_id],
            (response) => {
                if (!response?.chat || response.chat.id !== payload.chat_id)
                    return response
                return {
                    ...response,
                    chat: applyTypingToChat(response.chat, payload, now, true),
                }
            }
        )
    }

    function syncStopTyping(payload: TypingWhisperPayload) {
        if (payload.user_id === user.id) return
        const now = Date.now()

        queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
            if (!chats) return chats
            return chats.map((c) =>
                c.id === payload.chat_id ? applyTypingToChat(c, payload, now, false) : c
            )
        })

        queryClient.setQueryData<Chat>(["chat", payload.chat_id], (chat) => {
            if (!chat) return chat
            return applyTypingToChat(chat, payload, now, false)
        })

        queryClient.setQueryData<GetContactResponse>(
            ["contact", payload.user_id],
            (response) => {

                if (!response?.chat || response.chat.id !== payload.chat_id)
                    return response
                return {
                    ...response,
                    chat: applyTypingToChat(response.chat, payload, now, false),
                }
            }
        )
    }

    function addReceivedContactRequest(request: ContactRequest) {
        const sender = request.sender

        queryClient.setQueryData<unknown[] | undefined>(["pendingRequests"], (existing) => {
            const list = (existing as unknown[] | undefined) ?? []
            const alreadyExists = list.some((u: any) => u?.id === sender.id)
            if (alreadyExists) return list
            return [...list, sender]
        })

        queryClient.setQueryData<ApiSuccessResponse<any[]> | undefined>(
            ["contacts"],
            (existing) => {
                if (!existing) return existing
                const currentCount = Number(existing.extra?.pending_requests ?? 0)
                return {
                    ...existing,
                    extra: {
                        ...existing.extra,
                        pending_requests: currentCount + 1,
                    },
                }
            }
        )
    }

    function updateSentContactRequestStatus(request: ContactRequest) {
        const receiver = request.receiver
        const status: ContactRequestStatus = request.status

        queryClient.setQueryData<unknown[] | undefined>(["sentRequests"], (existing) => {
            const list = (existing as unknown[] | undefined) ?? []

            if (status === "pending") {
                const alreadyExists = list.some((u: any) => u?.id === receiver.id)
                if (alreadyExists) return list
                return [...list, receiver]
            }

            return list.filter((u: any) => u?.id !== receiver.id)
        })

        if (status === "accepted") {
            queryClient.setQueryData<ApiSuccessResponse<any[]> | undefined>(
                ["contacts"],
                (existing) => {
                    if (!existing) return existing
                    const alreadyExists = existing.data.some((u: any) => u?.id === receiver.id)
                    if (alreadyExists) return existing
                    return {
                        ...existing,
                        data: [...existing.data, receiver],
                    }
                }
            )
        }
    }

    return {
        syncMessage,
        syncTyping,
        syncStopTyping,
        appendGroupToGroupsList,
        addReceivedContactRequest,
        updateSentContactRequestStatus,
    }
}

export default useUpdateCache