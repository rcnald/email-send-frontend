import { Edit } from "lucide-react"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Component from "@/components/comp-511"
// Assuming you have Avatar components
import { Badge } from "@/components/ui/badge" // Assuming you have a Badge component
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
import { useClientStore } from "@/store/client-store"
import { useFileStore } from "@/store/file-store"

export const ResumeStep = () => {
  const navigate = useNavigate()
  const hasSelectedClient = useClientStore((state) => Boolean(state.client))
  const hasFilesToProceed = useFileStore(
    (state) => state.uploadedFiles.length > 0
  )

  useEffect(() => {
    if (!(hasFilesToProceed && hasSelectedClient)) {
      navigate(-1)
    }
  }, [hasFilesToProceed, hasSelectedClient, navigate])

  return (
    <>
      <Card className='w-[400px] self-start'>
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
            {/* Right: Status Badge */}
            <div className='flex items-center gap-3'>
              <div>
                <div className='font-normal text-muted-foreground text-sm hover:text-primary'>
                  Lucas Petz
                </div>
                <div className='font-medium text-foreground text-sm'>
                  84.982.569/0001-90
                </div>
              </div>
            </div>
            <Badge variant='default'>Ativo</Badge>
          </div>
          <div className='flex items-center justify-between gap-2 border-b border-dashed py-2 last:border-none'>
            {/* Right: Status Badge */}
            <div className='flex items-center gap-3'>
              <div>
                <div className='font-normal text-muted-foreground text-sm hover:text-primary'>
                  Avante
                </div>
                <div className='font-medium text-foreground text-sm'>
                  contabilidade@avante.com
                </div>
              </div>
            </div>
            <Badge variant='default'>Ativo</Badge>
          </div>
        </CardContent>
        <CardFooter className='justify-center'>
          <Button variant='link'>
            <Link to='#'>Learn more</Link>
          </Button>
        </CardFooter>
      </Card>
      <Component />
    </>
  )
}
