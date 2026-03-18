import { useEchoPresence } from "@laravel/echo-react"

const useMessengerChannel = () => {
    return useEchoPresence("messenger").channel
}

export default useMessengerChannel
