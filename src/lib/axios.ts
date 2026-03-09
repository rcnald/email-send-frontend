import axios, { type AxiosError, type AxiosInstance, isAxiosError } from "axios"
import type { ApiErrorData } from "@/api/@types/error"
import { env } from "@/env"

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export function getApiErrorMessages(error: AxiosError<ApiErrorData>): string[] {
  const messages: string[] = []

  const fieldErrors = error.response?.data?.data?.field_errors
  if (Array.isArray(fieldErrors)) {
    fieldErrors.forEach((field) => {
      messages.push(`${error.response?.data?.message} ${field}`)
    })
    return messages
  }
  const message =
    error.response?.data?.message || error.message || "Erro ao registrar."
  messages.push(
    `${message}: ${Object.values(error.response?.data?.data || {})
      .flat()
      .join(" ")}`
  )
  return messages
}

export const setupResponseInterceptor = (
  apiInstance: AxiosInstance,
  navigate: (path: string, options?: { replace: boolean }) => void
) => {
  const interceptorId = apiInstance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (isAxiosError<ApiErrorData>(error)) {
        const status = error.response?.status
        const code = error.response?.data.code
        const originalRequest = error.config as (typeof error.config & {
          _retry?: boolean
        }) | null
        const requestUrl = originalRequest?.url ?? ""
        const alreadyRetried = originalRequest?._retry === true
        const isRefreshRequest = requestUrl.includes("/auth/token/refresh")
        const isLogoutRequest = requestUrl.includes("/auth/logout")
        const shouldTryRefresh =
          status === 401 &&
          code === "UNAUTHORIZED" &&
          Boolean(originalRequest) &&
          !alreadyRetried &&
          !isRefreshRequest &&
          !isLogoutRequest

        if (shouldTryRefresh && originalRequest) {
          originalRequest._retry = true

          try {
            await apiInstance.patch("/auth/token/refresh")
            return apiInstance.request(originalRequest)
          } catch {
            navigate("/sign-in", { replace: true })
            return Promise.reject(error)
          }
        }

        if (status === 401 && code === "UNAUTHORIZED" && isRefreshRequest) {
          navigate("/sign-in", { replace: true })
        }
      }
      return Promise.reject(error)
    }
  )

  return interceptorId
}
