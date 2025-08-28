import { ArrowRightIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { useFileStore } from "@/store/file-store"

export const UploadStep = () => {
  const hasFilesToProceed = useFileStore(
    (state) => state.uploadedFiles.length > 0
  )

  return (
    <div className='grid w-full max-w-100 grid-cols-1 gap-5 self-start'>
      <FileUpload />
      {hasFilesToProceed ? (
        <Button
          asChild
          className='group w-full place-self-end lg:w-fit'
          variant='default'
        >
          <Link to={"/select-client"}>
            Continuar
            <ArrowRightIcon
              aria-hidden='true'
              className='-me-1 opacity-60 transition-transform group-hover:translate-x-0.5'
              size={16}
            />
          </Link>
        </Button>
      ) : (
        <Button
          className='group w-full place-self-end lg:w-fit'
          disabled={true}
          variant='default'
        >
          Continuar
          <ArrowRightIcon
            aria-hidden='true'
            className='-me-1 opacity-60 transition-transform group-hover:translate-x-0.5'
            size={16}
          />
        </Button>
      )}
    </div>
  )
}
