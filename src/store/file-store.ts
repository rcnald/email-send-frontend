import { create } from "zustand"

export type UploadFileItem = {
  id: string
  file: File
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
  attachmentId?: string | null
}

export interface FileStoreState {
  files: UploadFileItem[]
  actions: {
    updateFiles: (files: UploadFileItem[]) => void
  }
}

export const useFileStore = create<FileStoreState>((set) => ({
  files: [],
  actions: {
    updateFiles: (newFiles) => {
      set(() => ({ files: newFiles }))
    },
  },
}))
