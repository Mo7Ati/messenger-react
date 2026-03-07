import api from "@/lib/api";
import type { Chat, User } from "@/types/general";

export type ContactStatus = "none" | "request_sent" | "request_received" | "contacts"

export type GetContactResponse = {
    chat: Chat | null,
    contact: User,
}

export type PendingRequest = {
    id: number,
    user: User,
}


export type SearchUser = {
    id: number,
    name: string,
    email: string,
    avatar: string,
    avatar_url: string,
    contact_status: ContactStatus,
}

export const contactService = {
    getContacts: async (): Promise<User[]> => {
        const { data: contacts } = await api<User[]>("/contacts")
        return contacts;
    },
    getContact: async (id: number): Promise<GetContactResponse> => {
        const { data } = await api<GetContactResponse>(`/contacts/${id}`);
        return data;
    },
    searchUsers: async (query: string): Promise<SearchUser[]> => {
        const { data: users } = await api.get<SearchUser[]>(`/contacts/search`, { params: { query } });
        return users;
    },
    getPendingRequests: async (): Promise<PendingRequest[]> => {
        const { data: requests } = await api.get<PendingRequest[]>(`/contacts/requests`);
        return requests;
    },
    acceptContactRequest: async (id: number): Promise<void> => {
        await api.post(`/contacts/requests/${id}/accept`);
    },
    declineContactRequest: async (id: number): Promise<void> => {
        await api.post(`/contacts/requests/${id}/decline`);
    },
    sendContactRequest: async (id: number): Promise<void> => {
        await api.post(`/contacts/requests/${id}/send`);
    },
}