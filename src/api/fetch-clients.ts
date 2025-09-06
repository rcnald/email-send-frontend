import { api } from "@/lib/axios"

export interface FetchClientsResponse {
  clients: {
    id: string
    name: string
    CNPJ: string
    accountant: {
      name: string
      email: string
    }
    status: "sent" | "not_send"
  }[]
}

export const fetchClients = async () => {
  const { data } = await api.get<FetchClientsResponse>("/clients")

  return data
}
