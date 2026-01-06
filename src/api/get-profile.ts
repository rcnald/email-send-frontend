import { api } from "@/lib/axios"

export interface GetProfileResponse {
  name: string
  email: string
}

export const getProfile = async (): Promise<GetProfileResponse> => {
  const response = await api.get<GetProfileResponse>("/me")

  return response.data
}
