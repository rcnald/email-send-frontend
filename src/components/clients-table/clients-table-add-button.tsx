import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { PlusIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { createClient } from "@/api/create-client"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

const NON_DIGIT_REGEX = /\D/g
const LEADING_ZEROS_REGEX = /^0+/
const CNPJ_PATTERN_1 = /^(\d{2})(\d)/
const CNPJ_PATTERN_2 = /^(\d{2})\.(\d{3})(\d)/
const CNPJ_PATTERN_3 = /\.(\d{3})(\d)/
const CNPJ_PATTERN_4 = /(\d{4})(\d)/

const formatToCNPJ = (value: string): string => {
  const valueRaw = value
    .replace(NON_DIGIT_REGEX, "")
    .replace(LEADING_ZEROS_REGEX, "")
    .slice(0, 14)

  return valueRaw
    .padStart(14, "0")
    .replace(CNPJ_PATTERN_1, "$1.$2")
    .replace(CNPJ_PATTERN_2, "$1.$2.$3")
    .replace(CNPJ_PATTERN_3, ".$1/$2")
    .replace(CNPJ_PATTERN_4, "$1-$2")
}

const createClientSchema = z.object({
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  CNPJ: z
    .string()
    .min(1, "O CNPJ é obrigatório")
    .transform((val) => val.slice(0, 14))
    .refine((val) => {
      const numbers = val
        .replace(NON_DIGIT_REGEX, "")
        .replace(LEADING_ZEROS_REGEX, "")
      return numbers.length === 14
    }, "O CNPJ deve ter 14 dígitos"),
  accountant: z.object({
    name: z
      .string()
      .min(2, "O nome do contador deve ter no mínimo 2 caracteres"),
    email: z.email("Email inválido"),
  }),
})

type CreateClientSchema = z.infer<typeof createClientSchema>

export const ClientsTableAddButton = () => {
  const queryClient = useQueryClient()

  const { mutate: createClientFn } = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      toast.success(`Cliente ${getValues("name")} criado com sucesso`)
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message ?? error.message
        toast.error(message)
        return
      }

      if (error instanceof Error) {
        toast.error(error.message)
        return
      }

      toast.error("Erro desconhecido ao criar cliente")
    },
  })

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<CreateClientSchema>({
    resolver: zodResolver(createClientSchema),
  })

  const onSubmit = (data: CreateClientSchema) => {
    createClientFn(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='ml-auto' variant='outline'>
          <PlusIcon aria-hidden='true' className='-ms-1 opacity-60' size={16} />
          Adicionar cliente
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Adicionar Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados do cliente e do contador responsável.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='client-name'>Nome do Cliente</Label>
              <Input
                id='client-name'
                placeholder='Digite o nome do cliente'
                {...register("name")}
              />
              {errors.name && (
                <p className='text-destructive text-sm'>
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='client-cnpj'>CNPJ</Label>
              <Controller
                control={control}
                name='CNPJ'
                render={({ field }) => {
                  const displayValue = formatToCNPJ(field.value ?? "")

                  return (
                    <Input
                      id='client-cnpj'
                      inputMode='numeric'
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const newRaw = event.target.value
                          .replace(NON_DIGIT_REGEX, "")
                          .replace(LEADING_ZEROS_REGEX, "")
                        field.onChange(newRaw)
                      }}
                      placeholder='00.000.000/0000-00'
                      type='text'
                      value={displayValue}
                    />
                  )
                }}
              />
              {errors.CNPJ && (
                <p className='text-destructive text-sm'>
                  {errors.CNPJ.message}
                </p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='accountant-name'>Nome do Contador</Label>
              <Input
                id='accountant-name'
                placeholder='Digite o nome do contador'
                {...register("accountant.name")}
              />
              {errors.accountant?.name && (
                <p className='text-destructive text-sm'>
                  {errors.accountant.name.message}
                </p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='accountant-email'>Email do Contador</Label>
              <Input
                id='accountant-email'
                placeholder='contador@exemplo.com'
                type='email'
                {...register("accountant.email")}
              />
              {errors.accountant?.email && (
                <p className='text-destructive text-sm'>
                  {errors.accountant.email.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Cancelar
              </Button>
            </DialogClose>
            <Button type='submit'>Criar Cliente</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
