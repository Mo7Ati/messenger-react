import api from "@/lib/api"
import type { Message } from "@/types/general"

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export function validateAttachmentFile(file: File): string | null {
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return `"${file.name}" is too large (max 5 MB)`
    }
    return null
}

export type SendToConversationParams = {
    message: string
    chat_id: number
}

export type SendToUserParams = {
    message: string
    user_id: number
}

export type SendWithAttachmentsParams = {
    message?: string
    attachments: File[]
    chat_id?: number
    user_id?: number
}

function buildMessageFormData(params: SendWithAttachmentsParams): FormData {
    const form = new FormData()
    const caption = params.message?.trim() ?? ""
    form.append("message", caption)
    params.attachments.forEach((file) => form.append("attachments[]", file))
    if (params.chat_id != null) form.append("chat_id", String(params.chat_id))
    if (params.user_id != null) form.append("user_id", String(params.user_id))
    return form
}

export const messagesService = {
    sendToConversation: async (params: SendToConversationParams): Promise<Message> => {
        const { data } = await api.post<Message>("/messages", params)
        return data
    },
    sendToUser: async (params: SendToUserParams): Promise<Message> => {
        const { data } = await api.post<Message>("/messages", params)
        return data
    },
    sendWithAttachments: async (params: SendWithAttachmentsParams): Promise<Message> => {
        const formData = buildMessageFormData(params)
        const { data } = await api.request<Message>({
            method: "POST",
            url: "/messages",
            data: formData,
        })
        return data
    },
    fetchAttachmentBlob: async (url: string): Promise<Blob> => {
        const { data } = await api.get<Blob>(url, {
            responseType: "blob"
        })
        return data
    }
}
