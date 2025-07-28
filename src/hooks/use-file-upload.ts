import type React from "react"
import {
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from "react"
import { filterValidFiles } from "./use-file-upload.utils"

export type FileItem = {
  id: string
  file: File
}

export type FileUploadOptions = {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  onFilesChange?: (files: FileItem[]) => void
  onFilesAdded?: (addedFiles: FileItem[]) => void
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
  } = options

  const [state, setState] = useState<FileUploadState>({
    files: [],
    isDragging: false,
    errors: [],
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const clearFiles = useCallback(() => {
    setState((prev) => {
      if (inputRef.current) {
        inputRef.current.value = ""
      }

      const newState = {
        ...prev,
        files: [],
        errors: [],
      }

      onFilesChange?.(newState.files)

      return newState
    })
  }, [onFilesChange])

  const addFiles = useCallback(
    (rawFiles: FileList) => {
      if (!rawFiles || rawFiles.length === 0) {
        return
      }

      const files = Array.from(rawFiles)
      const errors: string[] = []

      setState((prev) => ({ ...prev, errors: [] }))

      if (!multiple) {
        clearFiles()
      }

      const { validFiles, errors: validationErrors } = filterValidFiles(
        files,
        state.files,
        { maxSize, accept }
      )

      errors.push(...validationErrors)

      const isTooManyFiles = state.files.length + validFiles.length > maxFiles

      if (isTooManyFiles) {
        errors.push(`Você pode enviar no máximo ${maxFiles} arquivos.`)
        setState((prev) => ({ ...prev, errors }))
        return
      }

      const hasErrors = errors.length > 0

      if (hasErrors) {
        setState((prev) => ({
          ...prev,
          errors,
        }))
      }

      const hasValidFiles = validFiles.length > 0

      if (!hasValidFiles) {
        return
      }

      onFilesAdded?.(validFiles)

      setState((prev) => {
        const filesToUpdate = multiple
          ? [...prev.files, ...validFiles]
          : validFiles

        onFilesChange?.(filesToUpdate)

        return {
          ...prev,
          files: filesToUpdate,
        }
      })

      if (inputRef.current) {
        inputRef.current.value = ""
      }
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
    ]
  )

  const removeFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const filesWithOutRemovedOne = prev.files.filter(
          (file) => file.id !== id
        )
        onFilesChange?.(filesWithOutRemovedOne)

        return {
          ...prev,
          files: filesWithOutRemovedOne,
          errors: [],
        }
      })
    },
    [onFilesChange]
  )

  const clearErrors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      errors: [],
    }))
  }, [])

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    setState((prev) => ({ ...prev, isDragging: true }))
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return
    }

    setState((prev) => ({ ...prev, isDragging: false }))
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setState((prev) => ({ ...prev, isDragging: false }))

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
