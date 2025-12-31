import { api } from "@/lib/axios"

export interface SignUpRequest {
  name: string
  email: string
  password: string
}

export const signUp = async ({
  name,
  email,
  password,
}: SignUpRequest): Promise<void> => {
  await api.post("/auth/register", { name, email, password })
}
