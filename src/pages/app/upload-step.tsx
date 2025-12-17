import { ArrowRightIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { useFileStore } from "@/store/file-store"

export const UploadStep = () => {
  const navigate = useNavigate()
  const hasFilesToProceed = useFileStore(
    (state) => state.uploadedFiles.length > 0
  )

  const handleNextStep = () => {
    if (hasFilesToProceed) {
      navigate("/select-client")
    }
  }

  return (
    <div className='grid w-full max-w-100 grid-cols-1 gap-5 self-start'>
      <FileUpload />
      <Button
        className='group w-full place-self-end lg:w-fit'
        disabled={!hasFilesToProceed}
        onClick={handleNextStep}
        variant='default'
      >
        Continuar
        <ArrowRightIcon
          aria-hidden='true'
          className='-me-1 opacity-60 transition-transform group-hover:translate-x-0.5'
          size={16}
        />
      </Button>
    </div>
  )
}
