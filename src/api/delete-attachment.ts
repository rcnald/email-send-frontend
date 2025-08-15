import { api } from "@/lib/axios"

export interface DeleteAttachmentRequest {
  attachmentId: string
}

export const deleteAttachment = async ({
  attachmentId,
}: DeleteAttachmentRequest) => {
  await api.delete(`/attachments/${attachmentId}/delete`)
}
