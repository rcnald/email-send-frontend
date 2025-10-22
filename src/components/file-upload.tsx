import { AlertCircleIcon, FileUpIcon, XIcon } from "lucide-react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { IoCloseCircleSharp } from "react-icons/io5"
import { TbZip } from "react-icons/tb"
import { Button } from "@/components/ui/button"
import { env } from "@/env"
import { type FileItem, useFileUpload } from "@/hooks/use-file-upload"
import { formatBytes } from "@/hooks/use-file-upload.utils"
import { uploader } from "@/services/uploader"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"

const STATUS = (process: number) => {
  return {
    uploading: `${process}%`,
    pending: <AiOutlineLoading3Quarters className='animate-spin' />,
    completed: <Badge>Enviado</Badge>,
    error: (
      <Badge variant='destructive'>
        <IoCloseCircleSharp />
        Falhou
      </Badge>
    ),
  }
}

export const FileUpload = () => {
  const maxFiles = env.VITE_MAX_FILE_COUNT
  const maxSize = env.VITE_MAX_FILE_SIZE
  const accept = env.VITE_ALLOWED_EXTENSIONS

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
        {files.map((file) => (
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
  const fileSize = formatBytes(file.size)
  const alreadyUploadedFileSize = formatBytes(
    file.size * (file.progress / 100),
    { label: false }
  )

  const status = STATUS(file.progress)[file.status]

  const handleRemove = () => {
    removeFile(file.id)
  }
  return (
    <div
      className='flex items-center justify-between gap-2 rounded-lg border bg-background p-2 pe-3'
      key={file.id}
    >
      <div className='flex w-full items-center gap-3 overflow-hidden'>
        <div className='flex size-12 shrink-0 items-center justify-center rounded-md bg-primary/20'>
          <TbZip className='size-6 text-primary' />
        </div>
        <div className='flex w-full flex-col py-1'>
          <p className='flex justify-between truncate font-medium text-[13px]'>
            <span className='font-mono'>{file.name}</span>
            <span>{status}</span>
          </p>
          <Progress className='mt-1 h-1' value={file.progress} />
          <p className='text-muted-foreground text-xs'>
            {alreadyUploadedFileSize} de {fileSize}
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
