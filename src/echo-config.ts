import { configureEcho } from "@laravel/echo-react"
import api from "./lib/api"

configureEcho({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT),
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",
    enabledTransports: import.meta.env.VITE_REVERB_SCHEME === "https" ? ["wss"] : ["ws"],
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