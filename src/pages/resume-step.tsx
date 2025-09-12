import { Edit } from "lucide-react"
import { useEffect } from "react"
import { FaBuildingUser } from "react-icons/fa6"
import { MdAlternateEmail } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { DatePicker } from "@/components/date-picker"
import { Badge } from "@/components/ui/badge"
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
import { maskCNPJ } from "@/lib/utils"
import { useClientStore } from "@/store/client-store"
import { useFileStore } from "@/store/file-store"

export const ResumeStep = () => {
  const navigate = useNavigate()
  const client = useClientStore((state) => state.client)
  const hasSelectedClient = Boolean(client)
  const hasFilesToProceed = useFileStore(
    (state) => state.uploadedFiles.length > 0
  )

  const clientCNPJ = maskCNPJ(client?.CNPJ ?? "")

  useEffect(() => {
    if (!(hasFilesToProceed && hasSelectedClient)) {
      navigate(-1)
    }
  }, [hasFilesToProceed, hasSelectedClient, navigate])

  return (
    <div className='w-[400px] self-start'>
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
        <CardContent className='py-1'>
          <div className='flex items-center justify-between gap-2 border-b border-dashed py-2 last:border-none'>
            <div className='flex flex-col gap-3'>
              <h1 className='text-start font-semibold text-muted-foreground text-normal tracking-tight'>
                Cliente
              </h1>
              <div className='flex items-center gap-2'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-border'>
                  <FaBuildingUser className='size-5 text-primary/60' />
                </div>
                <div>
                  <h2 className='font-medium text-foreground text-sm hover:text-primary'>
                    {client?.name}
                  </h2>
                  <p className='font-medium text-muted-foreground text-sm'>
                    {clientCNPJ}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-between gap-2 border-b border-dashed py-2 last:border-none'>
            <div className='flex flex-col gap-3'>
              <h1 className='text-start font-semibold text-muted-foreground text-normal tracking-tight'>
                Contador
              </h1>
              <div className='flex items-center gap-2'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-border'>
                  <MdAlternateEmail className='size-5 text-primary/60' />
                </div>
                <div>
                  <h2 className='font-medium text-foreground text-sm hover:text-primary'>
                    {client?.accountant.name}
                  </h2>
                  <p className='font-medium text-muted-foreground text-sm'>
                    avante@contabilidade.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex w-full flex-col px-1.5'>
          <DatePicker />
          <div className='flex w-full flex-col gap-3'>
            <h1 className='text-start font-semibold text-muted-foreground text-normal tracking-tight'>
              Arquivos
            </h1>
            <div className='flex items-center gap-2'>
              <Badge className='rounded-xs'>test.zip</Badge>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
