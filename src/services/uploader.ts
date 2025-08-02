import type { FileItem } from "@/hooks/use-file-upload"

export type Uploader = (params: {
  file: FileItem
  onSuccess: () => void
  onError: (error: Error) => void
  onProgress: (progress: number) => void
}) => void

export const uploader = ({
  onSuccess,
  onProgress,
}: {
  file: FileItem
  onSuccess: () => void
  onError: (error: Error) => void
  onProgress: (progress: number) => void
}) => {
  // Simulate upload process

  onProgress(0)

  setTimeout(() => {
    onProgress(50)
  }, 1000)

  setTimeout(() => {
    onProgress(100)
    onSuccess()
  }, 2000)
}
