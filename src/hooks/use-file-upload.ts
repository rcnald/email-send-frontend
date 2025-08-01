import type React from "react"
import {
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react"
import { validateFilesToUpload } from "./use-file-upload.utils"

export type Uploader = (params: {
  file: FileItem
  onSuccess: () => void
  onError: (error: Error) => void
  onProgress: (progress: number) => void
}) => void

export type FileItem = {
  id: string
  file: File
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
  attachmentId?: string | null
}

export type FileUploadOptions = {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  onFilesChange?: (files: FileItem[]) => void
  onFilesAdded?: (addedFiles: FileItem[]) => void
  uploader?: Uploader
}

export type FileUploadState = {
  files: FileItem[]
  isDragging: boolean
  errors: string[]
}

export type FileUploadActions = {
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
  | { type: "RESET" }
  | { type: "CLEAR_ERRORS" }
  | { type: "CLEAR_FILES" }
  | { type: "MARK_FILE_AS_COMPLETED"; payload: { id: string } }
  | { type: "ADD_ERRORS"; payload: string[] }
  | {
      type: "UPDATE_FILE_PROGRESS"
      payload: { file: FileItem; progress: number }
    }
  | { type: "UPDATE_DRAGGING"; payload: boolean }

const fileUploadReducer = (
  state: FileUploadState,
  action: FileUploadAction
) => {
  switch (action.type) {
    case "ADD_FILES":
      return { ...state, files: [...state.files, ...action.payload] }
    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter((file) => file.id !== action.payload.id),
      }
    case "RESET":
      return { files: [], isDragging: false, errors: [] }
    case "CLEAR_ERRORS":
      return { ...state, errors: [] }
    case "CLEAR_FILES":
      return { ...state, files: [] }
    case "MARK_FILE_AS_COMPLETED":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.id
            ? { ...file, status: "completed" as const, progress: 100 }
            : file
        ),
      }
    case "ADD_ERRORS":
      return {
        ...state,
        errors: [...state.errors, ...action.payload],
      }
    case "UPDATE_FILE_PROGRESS":
      return {
        ...state,
        files: state.files.map((file) =>
          file.id === action.payload.file.id
            ? { ...file, progress: action.payload.progress }
            : file
        ),
      }
    case "UPDATE_DRAGGING":
      return {
        ...state,
        isDragging: action.payload,
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

  const [state, dispatch] = useReducer(fileUploadReducer, {
    files: [],
    isDragging: false,
    errors: [],
  })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    onFilesChange?.(state.files)
  }, [state.files, onFilesChange])

  const clearFiles = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = ""
    }

    dispatch({ type: "CLEAR_FILES" })
  }, [])

  const uploadFiles = useCallback(
    ({ files }: { files: FileItem[] }) => {
      files.forEach((file) => {
        uploader?.({
          file,
          onSuccess: () => {
            dispatch({
              type: "MARK_FILE_AS_COMPLETED",
              payload: { id: file.id },
            })
          },
          onError: (error) => {
            dispatch({ type: "ADD_ERRORS", payload: [error.message] })
          },
          onProgress: (progress) => {
            dispatch({
              type: "UPDATE_FILE_PROGRESS",
              payload: { file, progress },
            })
          },
        })
      })
    },
    [uploader]
  )

  const addFiles = useCallback(
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

      const { validatedFiles: filesToAdd, errors: validationErrors } =
        validateFilesToUpload(files, state.files, { maxSize, accept })

      errors.push(...validationErrors)

      const isTooManyFiles = state.files.length + filesToAdd.length > maxFiles

      if (isTooManyFiles) {
        errors.push(`Você pode enviar no máximo ${maxFiles} arquivos.`)
        dispatch({ type: "ADD_ERRORS", payload: errors })
        return
      }

      const hasErrors = errors.length > 0

      if (hasErrors) {
        dispatch({ type: "ADD_ERRORS", payload: errors })
        return
      }

      const hasFilesToAdd = filesToAdd.length > 0

      if (!hasFilesToAdd) {
        return
      }

      const filesToUpdate = multiple
        ? [...state.files, ...filesToAdd]
        : filesToAdd

      onFilesAdded?.(filesToAdd)

      dispatch({ type: "ADD_FILES", payload: filesToUpdate })

      onFilesChange?.(filesToUpdate)

      if (inputRef.current) {
        inputRef.current.value = ""
      }

      uploadFiles?.({ files: filesToAdd })
    },
    [
      state.files,
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

  const removeFile = useCallback((id: string) => {
    dispatch({ type: "REMOVE_FILE", payload: { id } })
  }, [])

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
        multiple: props.multiple !== undefined ? props.multiple : multiple,
        ref: inputRef,
      }
    },
    [accept, multiple, handleFileChange]
  )

  return [
    state,
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
