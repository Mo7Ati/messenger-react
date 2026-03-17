import axios from "axios"

const BaseUrl = import.meta.env.VITE_API_URL

export const attachmentsService = {
    fetchBlob: async (attachmentId: number): Promise<Blob> => {
        const { data } = await axios.get<Blob>(
            `${BaseUrl}/api/messages/attachments/${attachmentId}`,
            {
                responseType: "blob",
                withCredentials: true,
            }
        )
        return data
    },
}
