import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type UploadFileItem = {
  id: string
  file: File
  name: string
  size: number
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
  attachmentId?: string | null
}

export interface FileStoreState {
  uploadedFiles: UploadFileItem[]
  actions: {
    addUploadedFile: (file: UploadFileItem) => void
    removeUploadedFile: (id: string) => void
    clearUploadedFiles: () => void
  }
}

export const useFileStore = create<FileStoreState>()(
  persist(
    (set) => ({
      uploadedFiles: [],
      actions: {
        addUploadedFile: (newFile) => {
          set((state) => ({
            uploadedFiles: [
              ...state.uploadedFiles,
              { ...newFile, status: "completed", progress: 100 },
            ],
          }))
        },
        removeUploadedFile: (id) => {
          set((state) => ({
            uploadedFiles: state.uploadedFiles.filter((file) => file.id !== id),
          }))
        },
        clearUploadedFiles: () => {
          set(() => ({ uploadedFiles: [] }))
        },
      },
    }),
    {
      name: "@email-send-1.0:file-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        uploadedFiles: state.uploadedFiles,
      }),
    }
  )
)
