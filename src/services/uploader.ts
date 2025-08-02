import type { FileItem } from "@/hooks/use-file-upload"
import { api } from "@/lib/axios"

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
    const formData = new FormData()
    formData.append("attachmentFile", file.file)

    const { data } = await api.post("/attachments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          )
          onProgress(progress)
        }
      },
    })

    const attachmentId: string = data?.attachmentId
    onSuccess(attachmentId)
  } catch (error) {
    onError(error as Error)
  }
}
