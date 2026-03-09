import type { Chat, User } from "./general"

export type ContactStatus = "none" | "request_sent" | "request_received" | "contacts"

export type GetContactResponse = {
    chat: Chat | null
    contact: User
}

export type PendingRequest = {
    id: number
    user: User
}

export type SearchUser = {
    id: number
    name: string
    username: string
    email: string
    avatar: string
    avatar_url: string
    contact_status: ContactStatus
}
