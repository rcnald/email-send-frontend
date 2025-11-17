import { api } from "@/lib/axios"

export interface CreateClientRequest {
  name: string
  CNPJ: string
  accountant: {
    name: string
    email: string
  }
}

export const createClient = async ({
  CNPJ,
  accountant,
  name,
}: CreateClientRequest): Promise<void> => {
  await api.post("/clients", {
    CNPJ,
    accountant_name: accountant.name,
    accountant_email: accountant.email,
    name,
  })
}
