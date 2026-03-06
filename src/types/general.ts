export type ConversationType = "peer" | "group"


export type User = {
    id: number;
    name: string;
    email: string;
    avatar_url: string
    bio: string
    last_active_at: string
    [key: string]: unknown;
};

export interface Message {
    id: string
    body: string
    user_id: number
    is_read_by_all: boolean
    is_mine: boolean
    created_at: string
    user: User
    conversation_id?: number
}

export type Chat = {
    id: number
    label: string
    type: ConversationType
    last_message: Message
    new_messages: number
    created_at: string
    participants: User[]
    messages: Message[]
}
