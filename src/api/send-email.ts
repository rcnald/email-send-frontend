import { api } from "@/lib/axios"

export interface SendEmailRequest {
  clientId: string
  attachmentIds: string[]
}

export interface SendEmailResponse {
  message: string
  data: {
    email_id?: string
  }
}

export const sendEmail = async ({
  clientId,
  attachmentIds,
}: SendEmailRequest): Promise<SendEmailResponse> => {
  const { data } = await api.post<SendEmailResponse>(
    "/emails",
    {
      client_id: clientId,
      attachment_ids: attachmentIds,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  )

  return { message: data.message, data: { email_id: data.data.email_id } }
}
