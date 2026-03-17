import api from "@/lib/api"
import type { User } from "@/types/general"

type UpdatePasswordData = {
    current_password: string
    password: string
    password_confirmation: string
}

export const profileService = {
    updateProfile: async (data: FormData): Promise<User> => {
        const { data: user } = await api.post<User>("/user/profile", data)
        return user
    },
    updatePassword: async (data: UpdatePasswordData): Promise<void> => {
        await api.put("/user/password", data)
    },
}
