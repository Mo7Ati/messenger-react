import api, { type ApiSuccessResponse } from "@/lib/api";
import type { User } from "@/types/general";
import type { GetContactResponse, SearchUser } from "@/types/contacts";

export const contactService = {
    getContacts: async (): Promise<ApiSuccessResponse<User[]>> => {
        const response = await api.get<User[]>("/contacts");
        return response;
    },
    getContact: async (id: number): Promise<GetContactResponse> => {
        const { data } = await api.get<GetContactResponse>(`/contacts/${id}`);
        return data;
    },
    searchUsers: async (query: string): Promise<SearchUser[]> => {
        const { data } = await api.get<SearchUser[]>(`/contacts/search`, { params: { query } });
        return data;
    },
    getPendingRequests: async (): Promise<User[]> => {
        const { data } = await api.get<User[]>(`/contacts/requests`);
        return data;
    },
    /** Sent (outgoing) contact requests. Replace with real endpoint when backend supports it. */
    getSentRequests: async (): Promise<User[]> => {
        const { data } = await api.get<User[]>(`/contacts/sent`);
        return data;
    },
    acceptContactRequest: async (id: number): Promise<void> => {
        await api.post(`/contacts/accept/${id}`);
    },
    declineContactRequest: async (id: number): Promise<void> => {
        await api.post(`/contacts/reject/${id}`);
    },
    sendContactRequest: async (userId: number): Promise<ApiSuccessResponse<null>> => {
        const response = await api.post<null>(`/contacts/request`, {
            receiver_id: userId,
        });
        return response;
    },
}