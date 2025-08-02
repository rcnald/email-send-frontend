import { create } from "zustand"

export type UploadFileItem = {
  id: string
  file: File
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

export const useFileStore = create<FileStoreState>((set) => ({
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
}))
