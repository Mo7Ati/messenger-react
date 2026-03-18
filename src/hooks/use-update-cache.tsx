import type { GetContactResponse, ContactRequest, ContactRequestStatus } from "@/types/contacts"
import type { Chat, ChatType, Message, TypingUser, User } from "@/types/general"
import { useUser } from "@/features/auth/auth-context"
import { useQueryClient } from "@tanstack/react-query"
import type { ApiSuccessResponse } from "@/lib/api"
import { chatsService } from "@/services/chats-service"


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

    function syncMessage(message: Message, contact?: User) {
        queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
            if (!chats) return chats

            const chatExists = chats.some((c) => c.id === message.chat_id)
            if (!chatExists) {
                return [
                    ...chats,
                    {
                        id: message.chat_id,
                        label: contact?.username ?? message.user.username,
                        last_message: message,
                        new_messages: message.is_mine ? 0 : 1,
                        created_at: message.created_at,
                        participants: [contact ?? message.user],
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
                    new_messages: message.is_mine ? 0 : chat.new_messages + 1,
                }
        })

        queryClient.setQueryData<GetContactResponse>(
            ["contact", contact?.id ?? message.user_id],
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
                            new_messages: message.is_mine ? 0 : chat.new_messages + 1,
                        },
                    }
            }
        )
    }

    function appendGroupToGroupsList(group: Chat) {
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

    function applyGroupRead(message: Message, participants: User[], readerUserId: number): Message {
        const reader = participants.find((p) => p.id === readerUserId)
        if (!reader) return message

        console.log(message);


        const currentReaders = message.readers ?? []
        const alreadyRead = currentReaders.some((r) => r.id === readerUserId)
        const newReaders = alreadyRead ? currentReaders : [...currentReaders, reader]

        const readerIds = new Set(newReaders.map((r) => r.id))
        const isReadByAll = participants
            .filter((p) => p.id !== message.user_id)
            .every((p) => readerIds.has(p.id))

        return { ...message, readers: newReaders, is_read_by_all: isReadByAll }
    }

    function syncReadStatus(chatId: number, userId?: number) {
        const groupReaderUserId = userId ?? user.id

        queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
            if (!chats) return chats
            return chats.map((c) => {
                if (c.id !== chatId) return c
                if (c.type === "peer") {
                    return {
                        ...c,
                        last_message: { ...c.last_message, is_read_by_all: true },
                    }
                } else {
                    return {
                        ...c,
                        last_message: applyGroupRead(c.last_message, c.participants, groupReaderUserId),
                    }
                }
            })
        })

        queryClient.setQueryData<Chat>(["chat", chatId], (chat) => {
            if (!chat) return chat
            if (chat.type === "peer") {
                return {
                    ...chat,
                    messages: chat.messages.map((m) => ({ ...m, is_read_by_all: true })),
                }
            } else {
                return {
                    ...chat,
                    messages: chat.messages.map((m) => applyGroupRead(m, chat.participants, groupReaderUserId)),
                }
            }
        })

        if (userId) {
            queryClient.setQueryData<GetContactResponse>(["contact", userId], (response) => {
                if (!response?.chat || response.chat.id !== chatId) return response
                return {
                    ...response,
                    chat: {
                        ...response.chat,
                        messages: response.chat.messages.map((m) => ({ ...m, is_read_by_all: true })),
                    },
                }
            })
        }
    }

    async function makeAsRead(chatId: number, contactId?: number) {
        if (!chatId) return

        await chatsService.markAsRead(chatId)

        queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
            if (!chats) return chats
            return chats.map((c) => c.id === chatId ? { ...c, new_messages: 0 } : c)
        })

        queryClient.setQueryData<Chat>(["chat", chatId], (chat) => {
            if (!chat) return chat
            return { ...chat, new_messages: 0 }
        })

        syncReadStatus(chatId, contactId)
    }

    return {
        syncMessage,
        syncTyping,
        syncStopTyping,
        syncReadStatus,
        appendGroupToGroupsList,
        addReceivedContactRequest,
        makeAsRead,
        updateSentContactRequestStatus,
    }
}

export default useUpdateCache