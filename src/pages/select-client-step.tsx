import { ArrowRightIcon } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ClientsTable } from "@/components/clients-table"
import { Button } from "@/components/ui/button"
import { useClientStore } from "@/store/client-store"
import { useFileStore } from "@/store/file-store"

export const SelectClientStep = () => {
  const navigate = useNavigate()
  const hasSelectedClient = useClientStore((state) => Boolean(state.client))
  const hasFilesToProceed = useFileStore(
    (state) => state.uploadedFiles.length > 0
  )

  const handleGoBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    if (!hasFilesToProceed) {
      navigate("/upload", { replace: true })
    }
  }, [hasFilesToProceed, navigate])

  return (
    <div className='grid grid-cols-1 gap-5 self-start'>
      <ClientsTable />
      <div className='flex w-full flex-col gap-3 place-self-end md:flex-row lg:w-fit'>
        <Button
          className='w-full lg:w-fit'
          onClick={handleGoBack}
          variant={"secondary"}
        >
          Voltar
        </Button>
        <Button className='group w-full lg:w-fit' disabled={!hasSelectedClient}>
          Continuar
          <ArrowRightIcon
            aria-hidden='true'
            className='-me-1 opacity-60 transition-transform group-hover:translate-x-0.5'
            size={16}
          />
        </Button>
      </div>
    </div>
  )
}
