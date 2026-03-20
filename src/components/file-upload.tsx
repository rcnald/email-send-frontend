import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileUpIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { env } from "@/env"
import { type FileItem, useFileUpload } from "@/hooks/use-file-upload"
import { formatBytes } from "@/hooks/use-file-upload.utils"
import { uploader } from "@/services/uploader"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"

const getExtensionsLabel = (accept: string) => {
  const extensions = accept
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)

  if (extensions.length === 0) {
    return "*"
  }

  return extensions.join(", ")
}

const getStatusLabel = (file: FileItem) => {
  if (file.status === "pending") {
    return (
      <Badge className='gap-1.5'>
        <Loader2Icon aria-hidden='true' className='size-3 animate-spin' />
        Processando
      </Badge>
    )
  }

  if (file.status === "uploading") {
    return (
      <span className='font-medium text-primary text-xs'>{file.progress}%</span>
    )
  }

  if (file.status === "completed") {
    return <Badge>Concluido</Badge>
  }

  return <Badge variant='destructive'>Falhou</Badge>
}

const FileStatusLabel = ({ file }: { file: FileItem }) => {
  const isCompleted = file.status === "completed"

  return (
    <AnimatePresence initial={false} mode='wait'>
      <motion.div
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -2 }}
        initial={{ opacity: 0, scale: 0.96, y: 2 }}
        key={file.status}
        transition={
          isCompleted
            ? { duration: 0.22, ease: "easeOut", type: "spring", bounce: 0.25 }
            : { duration: 0.16, ease: "easeOut" }
        }
      >
        {getStatusLabel(file)}
      </motion.div>
    </AnimatePresence>
  )
}

export const FileUpload = () => {
  const maxFiles = env.VITE_MAX_FILE_COUNT
  const maxSize = env.VITE_MAX_FILE_SIZE
  const accept = env.VITE_ALLOWED_EXTENSIONS

  const supportedExtensions = getExtensionsLabel(accept)

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
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
    <div className='space-y-5'>
      <div
        className='group relative flex min-h-[260px] w-full flex-col items-center justify-center rounded-2xl border border-border border-dashed bg-card p-6 text-center transition-colors hover:bg-muted/40 data-[dragging=true]:border-primary/70 data-[dragging=true]:bg-accent/20'
        data-dragging={isDragging}
      >
        <input
          {...getInputProps()}
          aria-label='Selecionar arquivos ZIP para upload'
          className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />

        <span
          aria-hidden='true'
          className='mb-5 inline-flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/20 text-primary'
        >
          <FileUpIcon className='size-6' />
        </span>

        <h3 className='font-semibold text-2xl text-card-foreground'>
          Arraste seus arquivos aqui
        </h3>
        <p className='mt-3 max-w-sm text-muted-foreground text-sm'>
          Ou clique para navegar no seu computador. Apenas arquivos ZIP sao
          aceitos.
        </p>

        <p className='mt-4 text-muted-foreground/80 text-xs'>
          Maximo de {maxFiles} arquivos no total - Tamanho maximo:{" "}
          {formatBytes(maxSize)} - Arquivos suportados: {supportedExtensions}
        </p>
      </div>

      {hasErrors ? (
        <div
          className='flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-xs'
          role='alert'
        >
          <AlertCircleIcon
            aria-hidden='true'
            className='mt-0.5 size-3 shrink-0'
          />
          <span>{errors[0]}</span>
        </div>
      ) : null}

      <section className='space-y-2'>
        <h4 className='font-mono font-semibold text-muted-foreground text-xs uppercase tracking-wide'>
          Arquivos em processamento ({files.length})
        </h4>

        <div className='space-y-2'>
          {files.map((file) => (
            <FileListItem file={file} key={file.id} removeFile={removeFile} />
          ))}
        </div>

        {hasMoreThanOneFile ? (
          <Button onClick={clearFiles} size='sm' type='button' variant='link'>
            Remover todos os arquivos
          </Button>
        ) : null}
      </section>
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
  const shouldShowProgress = file.status !== "completed"
  const alreadyUploadedFileSize = formatBytes(
    file.size * (file.progress / 100),
    { label: false }
  )

  const handleRemove = () => {
    removeFile(file.id)
  }

  return (
    <article className='rounded-xl border border-border bg-card px-3 py-2'>
      <div className='flex items-center gap-3'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/15'>
          <FileArchiveIcon aria-hidden='true' className='size-5 text-primary' />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='mb-1 flex items-center justify-between gap-2'>
            <p className='truncate font-medium text-[13px] text-card-foreground'>
              {file.name}
            </p>
            <FileStatusLabel file={file} />
          </div>

          <AnimatePresence initial={false}>
            {shouldShowProgress ? (
              <motion.div
                animate={{ height: "auto", opacity: 1 }}
                className='overflow-hidden'
                exit={{ height: 0, opacity: 0 }}
                initial={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Progress
                  className='h-1.5 bg-muted [&_[data-slot=progress-indicator]]:bg-primary'
                  value={file.progress}
                />
                <p className='mt-1 text-muted-foreground text-xs'>
                  {alreadyUploadedFileSize} de {fileSize}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <Button
          aria-label='Remover arquivo'
          className='size-8 text-muted-foreground hover:bg-transparent hover:text-foreground'
          onClick={handleRemove}
          size='icon'
          type='button'
          variant='ghost'
        >
          <XIcon aria-hidden='true' className='size-4' />
        </Button>
      </div>
    </article>
  )
}
