import axios, { type AxiosError } from "axios"
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
