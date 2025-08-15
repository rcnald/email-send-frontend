import { api } from "@/lib/axios"

export interface UploadAttachmentRequest {
  file: File
  onProgress?: (progress: number) => void
}

export interface UploadAttachmentResponse {
  attachment_id: string
}

export const uploadAttachment = async ({
  file,
  onProgress,
}: UploadAttachmentRequest): Promise<UploadAttachmentResponse> => {
  const formData = new FormData()
  formData.append("file", file)

  const { data } = await api.post<UploadAttachmentResponse>(
    "/attachments",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        const progress = Math.round((event.loaded * 100) / (event.total || 1))

        onProgress?.(progress)
      },
    }
  )

  return { attachment_id: data.attachment_id }
}
