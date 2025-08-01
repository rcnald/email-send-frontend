import { AlertCircleIcon, FileUpIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type FileItem, useFileUpload } from "@/hooks/use-file-upload"
import { formatBytes } from "@/hooks/use-file-upload.utils"
import { useFileStore } from "@/store/file-store"
import { FileArchiveIcon } from "./icons/file-archive"

export const FileUpload = () => {
  const maxFiles = 5
  const maxSize = 100 * 1024 * 1024 // 100MB
  const accept = ".zip"

  const actions = useFileStore((state) => state.actions)
  const storeFiles = useFileStore((state) => state.files)

  const uploader = ({
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

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept,
    onFilesChange: actions.updateFiles,
    uploader,
  })

  const hasErrors = errors.length > 0
  const hasMoreThanOneFile = files.length > 1

  return (
    <div className='flex w-full flex-col gap-2'>
      <button
        className='flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-primary border-dashed bg-accent p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-[input:focus]:border-ring has-disabled:opacity-50 has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50'
        data-dragging={isDragging}
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        tabIndex={-1}
        type='button'
      >
        <input
          {...getInputProps()}
          aria-label='Anexar arquivos'
          className='sr-only'
        />

        <div className='flex flex-col items-center justify-center text-center'>
          <div
            aria-hidden='true'
            className='mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border border-primary bg-accent'
          >
            <FileUpIcon className='size-4 text-primary text-opacity-60 ' />
          </div>
          <p className='mb-1.5 font-medium text-sm'>Anexar arquivos</p>
          <p className='mb-2 text-muted-foreground text-xs'>
            Arraste e solte o arquivo .zip aqui
          </p>
          <div className='flex flex-wrap justify-center gap-1 text-muted-foreground/70 text-xs'>
            <span>No máximo {maxFiles} arquivos</span>
            <span>∙</span>
            <span>Até {formatBytes(maxSize)}</span>
          </div>
        </div>
      </button>

      <div
        className='flex items-center gap-1 text-destructive text-xs'
        role='alert'
      >
        {hasErrors ? <AlertCircleIcon className='size-3 shrink-0' /> : null}
        <span>{errors[0]}</span>
      </div>

      <div className='space-y-2'>
        {storeFiles.map((file) => (
          <FileListItem file={file} key={file.id} removeFile={removeFile} />
        ))}

        {hasMoreThanOneFile ? (
          <div>
            <Button onClick={clearFiles} size='sm' variant='link'>
              Remover todos os arquivos
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const FileListItem = ({
  file,
  removeFile,
}: {
  file: FileItem
  removeFile: (id: string) => void
}) => {
  const handleRemove = () => {
    removeFile(file.id)
  }
  return (
    <div
      className='flex items-center justify-between gap-2 rounded-lg border bg-background p-1.5 pe-3'
      key={file.id}
    >
      <div className='flex items-center gap-3 overflow-hidden'>
        <div className='flex aspect-square size-10 shrink-0 items-center justify-center rounded'>
          <FileArchiveIcon className='size-5 text-primary opacity-60' />
        </div>
        <div className='flex min-w-0 flex-col'>
          <p className='truncate font-medium text-[13px]'>{file.file.name}</p>
          <p className='text-muted-foreground text-xs'>
            {formatBytes(file.file.size)}
          </p>
        </div>
      </div>

      <Button
        aria-label='Remove file'
        className='-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground'
        onClick={handleRemove}
        size='icon'
        variant='ghost'
      >
        <XIcon aria-hidden='true' className='size-4' />
      </Button>
    </div>
  )
}
