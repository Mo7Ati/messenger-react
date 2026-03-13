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

export type ContactRequestStatus = "pending" | "accepted" | "cancelled"

export type ContactRequest = {
    id: number
    sender: User
    receiver: User
    status: ContactRequestStatus
}

export type ContactRequestSentPayload = {
    contact_request: ContactRequest
}

export type ContactRequestUpdatedPayload = {
    contact_request: ContactRequest
}
