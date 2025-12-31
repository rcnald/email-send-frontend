export type ApiErrorData = {
  message: string
  data?: {
    field_errors?: string[]
    [key: string]: string | string[] | undefined
  }
}
