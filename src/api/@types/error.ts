export type ApiErrorData = {
  code: string
  message: string
  data?: {
    field_errors?: string[]
    [key: string]: string | string[] | undefined
  }
}
