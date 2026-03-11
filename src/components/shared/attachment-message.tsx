import type { Attachment } from '@/types/general'
import { File } from 'lucide-react'
import { PhotoProvider, PhotoView } from 'react-image-previewer';
import { Card, CardContent } from '@/components/ui/card';
import { formatFileSize } from '@/lib/utils';


function MessageAttachment({ attachments }: { attachments: Attachment[] }) {
    return (
        <PhotoProvider>
            {
                attachments.map((att) => {
                    const isImage = att.mime_type.startsWith('image/')

                    return (
                        <div className="mt-1.5 first:mt-0">
                            {isImage ? (
                                <PhotoView src={att.url}>
                                    <img src={att.url} alt={att.original_name} width={200} height={200} />
                                </PhotoView>
                            ) : (
                                <Card className={"relative p-4 cursor-pointer"} key={att.id}>
                                    <CardContent className="flex items-center space-x-3 rtl:space-x-reverse p-0" onClick={() => window.open(att.url, '_blank')}>
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                                            <File className="h-5 w-5 text-foreground" aria-hidden={true} />
                                        </span>
                                        <div>
                                            <p className="text-pretty font-medium text-foreground">{att.original_name}</p>
                                            <p className="text-pretty mt-0.5 text-sm text-muted-foreground">
                                                {formatFileSize(att.size)}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )
                })
            }
        </PhotoProvider>
    )
}


export default MessageAttachment
