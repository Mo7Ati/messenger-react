import api from "@/lib/api"
import type { User } from "@/types/general"

const getCsrfCookie = async () => {
    await api.get("/sanctum/csrf-cookie", { baseURL: `${import.meta.env.VITE_API_URL}` })
}

export const authService = {
    checkAuth: async (): Promise<User> => {
        const { data } = await api.get<User>("/user")
        return data
    },
    login: async (email: string, password: string): Promise<User> => {
        await getCsrfCookie()
        const { data } = await api.post<User>("/login", { email, password })
        return data
    },
    register: async (name: string, email: string, password: string): Promise<User> => {
        await getCsrfCookie()
        const { data } = await api.post<User>("/register", { name, email, password })
        return data
    },
    logout: async (): Promise<void> => {
        await api.post("/logout")
    },
    forgotPassword: async (email: string): Promise<void> => {
        await getCsrfCookie()
        await api.post("/forgot-password", { email })
    },
    resetPassword: async (
        email: string,
        token: string,
        password: string,
        password_confirmation: string
    ): Promise<void> => {
        await getCsrfCookie()
        await api.post("/reset-password", { email, token, password, password_confirmation })
    },
}
