export type ChatType = "peer" | "group"


export type User = {
    id: number;
    username: string;
    email: string;
    avatar_url: string
    bio: string
    last_active_at: string
    [key: string]: unknown;
};

export type Attachment = {
    id: number
    original_name: string
    mime_type: string
    size: number
    url: string
}

export type Message = {
    id: string
    body: string
    user_id: number
    is_read_by_all: boolean
    is_mine: boolean
    created_at: string
    user: User
    chat_id?: number
    type?: "text" | "attachment"
    attachments?: Attachment[]
    chat?: Chat
}

export type Chat = {
    id: number
    label: string
    type: ChatType
    last_message: Message
    new_messages: number
    created_at: string
    participants: User[]
    messages: Message[]
}
