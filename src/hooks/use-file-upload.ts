import type React from "react"
import {
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from "react"
import { deleteAttachment } from "@/api/delete-attachment"
import type { Uploader } from "@/services/uploader"
import { useFileStore } from "@/store/file-store"
import { validateFilesToUpload } from "./use-file-upload.utils"

export interface FileItem {
  id: string
  file: File
  name: string
  size: number
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
  attachmentId?: string | null
}

export interface FileUploadOptions {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  onFilesChange?: (files: FileItem[]) => void
  onFilesAdded?: (addedFiles: FileItem[]) => void
  uploader?: Uploader
}

export interface FileUploadState {
  localFiles: FileItem[]
  uploadedFiles: FileItem[]
  files: FileItem[]
  isDragging: boolean
  errors: string[]
}

export interface FileUploadLocalState {
  localFiles: FileItem[]
  cancelledFiles: Set<string>
  isDragging: boolean
  errors: string[]
}

export interface FileUploadActions {
  addFiles: (files: FileList) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  clearErrors: () => void
  handleDragEnter: (e: DragEvent<HTMLElement>) => void
  handleDragLeave: (e: DragEvent<HTMLElement>) => void
  handleDragOver: (e: DragEvent<HTMLElement>) => void
  handleDrop: (e: DragEvent<HTMLElement>) => void
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  openFileDialog: () => void
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>
  }
}

type FileUploadAction =
  | { type: "ADD_FILES"; payload: FileItem[] }
  | { type: "REMOVE_FILE"; payload: { id: string } }
  | { type: "CANCEL_FILE"; payload: { id: string } }
  | { type: "CLEAR_ERRORS" }
  | { type: "CLEAR_FILES" }
  | { type: "ADD_ERRORS"; payload: string[] }
  | {
      type: "UPDATE_FILE_PROGRESS"
      payload: { file: FileItem; progress: number }
    }
  | { type: "UPDATE_DRAGGING"; payload: boolean }
  | {
      type: "UPDATE_STATUS"
      payload: { id: string; status: FileItem["status"] }
    }

const fileUploadReducer = (
  state: FileUploadLocalState,
  action: FileUploadAction
) => {
  switch (action.type) {
    case "ADD_FILES":
      return { ...state, localFiles: [...state.localFiles, ...action.payload] }
    case "REMOVE_FILE":
      return {
        ...state,
        localFiles: state.localFiles.filter(
          (file) => file.id !== action.payload.id
        ),
      }
    case "CANCEL_FILE":
      return {
        ...state,
        localFiles: state.localFiles.filter(
          (file) => file.id !== action.payload.id
        ),
        cancelledFiles: new Set([...state.cancelledFiles, action.payload.id]),
      }
    case "CLEAR_ERRORS":
      return { ...state, errors: [] }
    case "CLEAR_FILES":
      return { ...state, localFiles: [] }
    case "ADD_ERRORS":
      return {
        ...state,
        errors: [...state.errors, ...action.payload],
      }
    case "UPDATE_FILE_PROGRESS":
      return {
        ...state,
        localFiles: state.localFiles.map<FileItem>((file) =>
          file.id === action.payload.file.id
            ? {
                ...file,
                progress: action.payload.progress,
                status: "uploading",
              }
            : file
        ),
      }
    case "UPDATE_DRAGGING":
      return {
        ...state,
        isDragging: action.payload,
      }
    case "UPDATE_STATUS":
      return {
        ...state,
        localFiles: state.localFiles.map((file) =>
          file.id === action.payload.id
            ? { ...file, status: action.payload.status }
            : file
        ),
      }
    default:
      throw new Error("Ação não esperada")
  }
}

export const useFileUpload = (
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
  const {
    maxFiles = 5,
    maxSize = 100 * 1024 * 1024, // 100MB
    accept = "*",
    multiple = false,
    onFilesChange,
    onFilesAdded,
    uploader,
  } = options

  const [localState, dispatch] = useReducer(fileUploadReducer, {
    localFiles: [],
    cancelledFiles: new Set<string>(),
    isDragging: false,
    errors: [],
  })

  const actions = useFileStore((state) => state.actions)
  const uploadedFiles = useFileStore((state) => state.uploadedFiles)

  const inputRef = useRef<HTMLInputElement>(null)

  const stateRef = useRef(localState)
  stateRef.current = localState

  const isFileCancelled = useCallback((file: FileItem) => {
    return stateRef.current.cancelledFiles.has(file.id)
  }, [])

  const allFiles = useMemo(() => {
    return [...uploadedFiles, ...localState.localFiles]
  }, [uploadedFiles, localState.localFiles])

  const clearFiles = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = ""
    }

    const attachmentIds = uploadedFiles
      .map((file) => file.attachmentId)
      .filter((attachmentId): attachmentId is string => Boolean(attachmentId))

    dispatch({ type: "CLEAR_FILES" })
    actions.clearUploadedFiles()

    if (attachmentIds.length === 0) {
      return
    }

    Promise.allSettled(
      attachmentIds.map((attachmentId) => deleteAttachment({ attachmentId }))
    ).then((results) => {
      const failedDeletions = results.filter(
        (result) => result.status === "rejected"
      ).length

      if (failedDeletions > 0) {
        dispatch({
          type: "ADD_ERRORS",
          payload: [
            `Não foi possível remover ${failedDeletions} anexo(s) do servidor.`,
          ],
        })
      }
    })
  }, [actions.clearUploadedFiles, uploadedFiles])

  const uploadFiles = useCallback(
    ({ files }: { files: FileItem[] }) => {
      files.forEach((file) => {
        uploader?.({
          file,
          onSuccess: (attachmentId) => {
            if (isFileCancelled(file)) {
              return
            }

            dispatch({ type: "REMOVE_FILE", payload: { id: file.id } })

            const completedFile = {
              ...file,
              attachmentId,
            }

            actions.addUploadedFile(completedFile)
          },
          onError: (error) => {
            if (isFileCancelled(file)) {
              return
            }

            dispatch({
              type: "UPDATE_STATUS",
              payload: { id: file.id, status: "error" },
            })

            dispatch({
              type: "ADD_ERRORS",
              payload: [error.message],
            })
          },
          onProgress: (progress) => {
            if (isFileCancelled(file)) {
              return
            }

            dispatch({
              type: "UPDATE_FILE_PROGRESS",
              payload: { file, progress },
            })
          },
        })
      })
    },
    [uploader, actions.addUploadedFile, isFileCancelled]
  )

  const addFiles = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <works fine as is>
    (rawFiles: FileList) => {
      if (!rawFiles || rawFiles.length === 0) {
        return
      }

      const files = Array.from(rawFiles)
      const errors: string[] = []

      dispatch({ type: "CLEAR_ERRORS" })

      if (!multiple) {
        clearFiles()
      }

      const existingFiles = multiple ? allFiles : []

      const { validatedFiles, errors: validationErrors } =
        validateFilesToUpload(files, existingFiles, { maxSize, accept })

      errors.push(...validationErrors)

      const remainingSlots = maxFiles - existingFiles.length

      if (remainingSlots <= 0) {
        errors.push(`Você pode enviar no máximo ${maxFiles} arquivos.`)
        dispatch({ type: "ADD_ERRORS", payload: errors })
        return
      }

      const filesToAdd = validatedFiles.slice(0, remainingSlots)

      if (filesToAdd.length > remainingSlots) {
        errors.push(`Você pode enviar no máximo ${maxFiles} arquivos.`)
      }

      const hasErrors = errors.length > 0

      if (hasErrors && filesToAdd.length === 0) {
        dispatch({ type: "ADD_ERRORS", payload: errors })
        return
      }

      const hasFilesToAdd = filesToAdd.length > 0

      if (!hasFilesToAdd) {
        return
      }

      const filesToUpdate = multiple ? [...allFiles, ...filesToAdd] : filesToAdd

      onFilesAdded?.(filesToAdd)

      dispatch({ type: "ADD_FILES", payload: filesToAdd })

      onFilesChange?.(filesToUpdate)

      if (hasErrors) {
        dispatch({ type: "ADD_ERRORS", payload: errors })
      }

      if (inputRef.current) inputRef.current.value = ""

      uploadFiles({ files: filesToAdd })
    },
    [
      allFiles,
      maxFiles,
      multiple,
      maxSize,
      accept,
      clearFiles,
      onFilesChange,
      onFilesAdded,
      uploadFiles,
    ]
  )

  const removeFile = useCallback(
    async (id: string) => {
      const isLocalFile = localState.localFiles.some((file) => file.id === id)

      if (isLocalFile) {
        dispatch({ type: "CANCEL_FILE", payload: { id } })
        return
      }

      actions.removeUploadedFile(id)

      const uploadedFileToRemove = uploadedFiles.find((file) => file.id === id)

      if (!uploadedFileToRemove?.attachmentId) {
        return
      }

      await deleteAttachment({
        attachmentId: uploadedFileToRemove?.attachmentId,
      })
    },
    [actions.removeUploadedFile, localState.localFiles, uploadedFiles]
  )

  const clearErrors = useCallback(() => {
    dispatch({ type: "CLEAR_ERRORS" })
  }, [])

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch({ type: "UPDATE_DRAGGING", payload: true })
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return
    }

    dispatch({ type: "UPDATE_DRAGGING", payload: false })
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()

      dispatch({ type: "UPDATE_DRAGGING", payload: false })

      if (inputRef.current?.disabled) {
        return
      }

      const hasFileToAdd = e.dataTransfer.files.length > 0

      if (hasFileToAdd) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles]
  )

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files)
      }
    },
    [addFiles]
  )

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }, [])

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => {
      return {
        ...props,
        type: "file" as const,
        onChange: handleFileChange,
        accept: props.accept || accept,
        multiple: props.multiple === undefined ? multiple : props.multiple,
        ref: inputRef,
      }
    },
    [accept, multiple, handleFileChange]
  )

  return [
    {
      localFiles: localState.localFiles,
      files: allFiles,
      uploadedFiles,
      isDragging: localState.isDragging,
      errors: localState.errors,
    },
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ]
}
