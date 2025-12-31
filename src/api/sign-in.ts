import { api } from "@/lib/axios"

export interface SignInRequest {
  email: string
  password: string
}

export const signIn = async ({
  email,
  password,
}: SignInRequest): Promise<void> => {
  await api.post("/auth/login", { email, password })
}
