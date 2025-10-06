import type { FileItem, FileUploadOptions } from "./use-file-upload"

export type FormatByteFunction = (
  bytes: number,
  options?: FormatBytesOptions
) => string

export interface FormatBytesOptions {
  decimals?: number
  label?: boolean
}

export const formatBytes: FormatByteFunction = (
  bytes,
  { decimals = 2, label = true } = {}
): string => {
  if (bytes === 0) {
    return "0 Bytes"
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${label ? sizes[i] : ""}`
}

export const generateUniqueId = (file: File): string => {
  return `${file.name}-${file.lastModified}-${Math.random().toString(36).substring(2, 9)}`
}

const validateFileSize = (file: File, maxSize: number): string | null => {
  if (file.size > maxSize) {
    return `Arquivo "${file.name}" excede o tamanho máximo de ${formatBytes(maxSize)}.`
  }

  return null
}

const validateFileType = (file: File, accept: string): string | null => {
  if (accept === "*") {
    return null
  }

  const acceptedTypes = accept.split(",").map((type) => type.trim())
  const fileType = file.type
  const fileExtension = `.${file.name.split(".").pop()}`

  const isAccepted = acceptedTypes.some((type) => {
    if (type.startsWith(".")) {
      return fileExtension.toLowerCase() === type.toLowerCase()
    }

    if (type.endsWith("/*")) {
      const baseType = type.split("/")[0]
      return fileType.startsWith(`${baseType}/`)
    }

    return fileType === type
  })

  if (!isAccepted) {
    return `Arquivo "${file.name}" não é de um tipo aceito.`
  }
  return null
}

export const validateFile = (
  file: File,
  options: Pick<FileUploadOptions, "maxSize" | "accept">
): string | null => {
  const { maxSize = Number.POSITIVE_INFINITY, accept = "*" } = options

  const sizeError = validateFileSize(file, maxSize)

  if (sizeError) {
    return sizeError
  }
  const typeError = validateFileType(file, accept)

  if (typeError) {
    return typeError
  }

  return null
}

export const validateFilesToUpload = (
  files: File[],
  existingFiles: FileItem[],
  options: Pick<FileUploadOptions, "maxSize" | "accept">
): { validatedFiles: FileItem[]; errors: string[] } => {
  const validatedFiles: FileItem[] = []
  const errors: string[] = []

  files.forEach((file) => {
    const alreadyExists = existingFiles.some(
      (existingFile) =>
        existingFile.file.name === file.name &&
        existingFile.file.size === file.size
    )
    if (alreadyExists) {
      return
    }

    const validationError = validateFile(file, options)

    if (validationError) {
      errors.push(validationError)
      return
    }

    validatedFiles.push({
      file,
      name: file.name,
      size: file.size,
      id: generateUniqueId(file),
      status: "pending",
      progress: 0,
    })
  })

  return { validatedFiles, errors }
}
