import { ArrowRightIcon, CircleDotIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { FileUpload } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { PageSeo } from "@/lib/seo"
import { useFileStore } from "@/store/file-store"

const instructions = [
  "Certifique-se de que os arquivos XML estejam na raiz do arquivo ZIP.",
  "Evite caracteres especiais ou espacos nos nomes dos arquivos para manter a integridade.",
  "Voce podera selecionar os destinatarios e o periodo fiscal na proxima etapa.",
] as const

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
    <div className='w-full self-start'>
      <PageSeo
        description='Faça upload de arquivos ZIP com documentos fiscais para iniciar o envio no Invoice.'
        title='Upload'
      />
      <section className='mb-6 space-y-2'>
        <h1 className='font-semibold text-3xl text-foreground tracking-tight'>
          Upload de Documentos
        </h1>
        <p className='max-w-3xl text-muted-foreground text-sm'>
          Selecione ou arraste os arquivos ZIP contendo os documentos fiscais
          para processamento.
        </p>
      </section>

      <div className='grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]'>
        <div className='space-y-5'>
          <FileUpload />
        </div>

        <aside className='space-y-4'>
          <div className='rounded-2xl border border-border bg-card p-5'>
            <h2 className='mb-4 flex items-center gap-2 font-semibold text-card-foreground text-sm'>
              <CircleDotIcon
                aria-hidden='true'
                className='size-4 text-primary'
              />
              Orientacoes de Envio
            </h2>

            <ul className='space-y-3 text-muted-foreground text-sm'>
              {instructions.map((instruction) => (
                <li className='flex gap-2.5' key={instruction}>
                  <span
                    aria-hidden='true'
                    className='mt-2 size-1.5 rounded-full bg-primary'
                  />
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='rounded-2xl border border-primary/25 bg-primary/10 p-5'>
            <p className='mb-4 text-foreground text-sm'>
              Pronto para prosseguir? Todos os arquivos listados serao
              vinculados aos clientes que voce escolher.
            </p>

            <Button
              className='group w-full justify-between'
              disabled={!hasFilesToProceed}
              onClick={handleNextStep}
              type='button'
              variant='default'
            >
              Proxima Etapa: Clientes
              <ArrowRightIcon
                aria-hidden='true'
                className='opacity-80 transition-transform group-hover:translate-x-0.5'
                size={16}
              />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
