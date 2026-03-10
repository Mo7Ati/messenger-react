import { configureEcho } from "@laravel/echo-react"
import api from "@/lib/api"

configureEcho({
    broadcaster: "reverb",
    authorizer: (channel) => ({
        authorize: (socketId, callback) => {
            api.post(
                "/broadcasting/auth",
                { socket_id: socketId, channel_name: channel.name },
                { baseURL: import.meta.env.VITE_API_URL, withCredentials: true }
            )
                .then((res: any) => callback(null, res))
                .catch((err) => callback(err, null))
        },
    }),
})