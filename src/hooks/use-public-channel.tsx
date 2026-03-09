import { echo } from '@laravel/echo-react'


const CHANNEL_NAME = "messenger"


export const usePublicChannel = () => {
    const channel = echo().join(CHANNEL_NAME)
    return {
        channel
    }
}