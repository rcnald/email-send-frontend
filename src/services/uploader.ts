import { uploadAttachment } from "@/api/upload-attachment"
import type { FileItem } from "@/hooks/use-file-upload"

export type Uploader = (params: {
  file: FileItem
  onSuccess: (attachmentId: string) => void
  onError: (error: Error) => void
  onProgress: (progress: number) => void
}) => void

export const uploader = async ({
  file,
  onSuccess,
  onError,
  onProgress,
}: {
  file: FileItem
  onSuccess: (attachmentId: string) => void
  onError: (error: Error) => void
  onProgress: (progress: number) => void
}) => {
  try {
    const { attachment_id } = await uploadAttachment({
      file: file.file,
      onProgress,
    })

    onSuccess(attachment_id)
  } catch (error) {
    onError(error as Error)
  }
}
