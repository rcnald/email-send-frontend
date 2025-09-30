// TODO: refactor to use react-query mutation and modularize the components
import { ArrowRightIcon, Edit } from "lucide-react"
import { useEffect } from "react"
import { FaSuitcase } from "react-icons/fa6"
import { MdAlternateEmail } from "react-icons/md"
import { TbZip } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import { SendEmail } from "@/api/send-email"
import { DatePicker } from "@/components/date-picker"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card"
import { formatBytes } from "@/hooks/use-file-upload.utils"
import { maskCNPJ } from "@/lib/utils"
import { useClientStore } from "@/store/client-store"
import { useFileStore } from "@/store/file-store"

export const ResumeStep = () => {
  const navigate = useNavigate()

  const client = useClientStore((state) => state.client)
  const files = useFileStore((state) => state.uploadedFiles)

  const clientActions = useClientStore((state) => state.actions)
  const fileActions = useFileStore((state) => state.actions)

  const hasSelectedClient = Boolean(client)
  const hasFilesToProceed = files.length > 0

  const clientCNPJ = maskCNPJ(client?.CNPJ ?? "")

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleNextStep = async () => {
    if (hasFilesToProceed && hasSelectedClient) {
      const { data } = await SendEmail({
        clientId: client?.id ?? "",
        attachmentIds: files.map((file) => file.attachmentId ?? ""),
      })

      const emailId = data.email_id

      if (emailId) {
        clientActions.clearClient()
        fileActions.clearUploadedFiles()
      }
    }
  }

  useEffect(() => {
    if (!(hasFilesToProceed && hasSelectedClient)) {
      navigate(-1)
    }
  }, [hasFilesToProceed, hasSelectedClient, navigate])

  return (
    <div className='flex w-[500px] flex-col gap-5 self-start'>
      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>Resumo do envio</CardTitle>
          </CardHeading>
          <CardToolbar>
            <Button size='icon' variant='outline'>
              <Edit />
            </Button>
          </CardToolbar>
        </CardHeader>
        <CardContent className='grid grid-cols-2 py-3'>
          <div className='flex flex-col items-center justify-between gap-2 py-2 last:border-none'>
            <div className='flex w-full gap-3'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-md bg-primary'>
                <FaSuitcase className='size-5 text-primary-foreground' />
              </div>
              <div>
                <h1 className='font-medium text-foreground text-normal hover:text-primary'>
                  {client?.name}
                </h1>
                <h2 className='text-start font-semibold text-normal text-primary text-sm tracking-tight'>
                  Cliente
                </h2>
              </div>
            </div>
            <p className='w-full font-medium font-mono text-muted-foreground text-sm'>
              {clientCNPJ}
            </p>
          </div>

          <div className='flex flex-col items-center justify-between gap-2 py-2 last:border-none'>
            <div className='flex w-full gap-3'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-md bg-primary'>
                <MdAlternateEmail className='size-5 text-primary-foreground' />
              </div>
              <div>
                <h1 className='font-medium text-foreground text-normal hover:text-primary'>
                  {client?.accountant.name}
                </h1>
                <h2 className='text-start font-semibold text-normal text-primary text-sm tracking-tight'>
                  Contador
                </h2>
              </div>
            </div>
            <p className='w-full font-medium font-mono text-muted-foreground text-sm'>
              {client?.accountant.email}
            </p>
          </div>
        </CardContent>
        <CardFooter className='flex w-full flex-col px-5 pb-5'>
          <DatePicker />
          <div className='flex w-full flex-col gap-3'>
            <h1 className='text-start font-semibold text-muted-foreground text-normal tracking-tight'>
              Arquivos
            </h1>
            <div className='flex items-center gap-2'>
              {files.map((file) => (
                <div
                  className='flex flex-1 gap-2 rounded-lg border border-input bg-background p-2'
                  key={file.attachmentId}
                >
                  <div className='flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/20'>
                    <TbZip className='size-6 text-primary' />
                  </div>
                  <span className='flex flex-col'>
                    <span className='font-bold text-sm'>{file.name}</span>
                    <span className='font-medium text-ring text-xs'>
                      {formatBytes(file.size)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className='flex w-full flex-col gap-3 place-self-end md:flex-row lg:w-fit'>
        <Button
          className='w-full lg:w-fit'
          onClick={handleGoBack}
          variant={"secondary"}
        >
          Voltar
        </Button>
        <Button
          className='group w-full lg:w-fit'
          disabled={!hasSelectedClient}
          onClick={handleNextStep}
        >
          Enviar
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
