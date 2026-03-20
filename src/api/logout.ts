import { api } from "@/lib/axios"

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout", undefined, {
    withCredentials: true,
  })
}
