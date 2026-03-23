import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import type { ApiErrorData } from "@/api/@types/error"
import { signIn } from "@/api/sign-in"
import { EmailIcon } from "@/components/icons/email"
import { Button } from "@/components/ui/button"
import { Input, InputFeedback } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getApiErrorMessages } from "@/lib/axios"
import { PageSeo } from "@/lib/seo"

const signInSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

type SignInSchema = z.infer<typeof signInSchema>

export const SignIn = () => {
  const [searchParams] = useSearchParams()

  const email = searchParams.get("email")

  const {
    register,
    handleSubmit,
    setFocus,
    watch,
    formState: { errors, isValid },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: email || "",
    },
  })

  const navigate = useNavigate()

  const emailValue = watch("email").trim()
  const shouldShowPasswordFields = !errors.email && emailValue.length > 0

  const { mutateAsync: loginHelper, isPending } = useMutation({
    mutationFn: signIn,
    onError: (error: AxiosError<ApiErrorData>) => {
      const messages = getApiErrorMessages(error)

      for (const message of messages) {
        toast.error(message)
      }
    },
    onSuccess() {
      toast.success("Login realizado com sucesso!")
      navigate("/upload")
    },
  })

  const canLogin = isValid && !isPending

  const onSubmit = async ({ email, password }: SignInSchema) => {
    await loginHelper({ email, password })
  }

  useEffect(() => {
    setFocus("email")
  }, [setFocus])

  return (
    <div className='relative flex w-full max-w-[335px] flex-col items-center gap-8'>
      <PageSeo
        description='Acesse sua conta Invoice para enviar documentos fiscais com seguranca e rapidez.'
        title='Entrar'
      />
      <div className='flex flex-col items-center gap-8'>
        <div className='flex w-fit rounded-sm border-gradient bg-linear-(--primary-gradient) p-2'>
          <EmailIcon className='text-2xl text-pink-start' />
        </div>
        <div className='flex flex-col items-center gap-2'>
          <h1 className='text-center font-jakarta font-semibol text-xl sm:text-[32px]'>
            Bem-vindo de volta
          </h1>
          <p className='text-center font-sans text-muted-foreground text-xs'>
            Acesse sua conta. Entre com suas credenciais para gerenciar seus
            clientes e envios fiscais.
          </p>
        </div>
      </div>

      <form
        className='flex w-full flex-col items-center gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex w-full flex-col gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            aria-invalid={Boolean(errors.email)}
            id='email'
            placeholder='ronaldo@example.com'
            type='email'
            {...register("email")}
          />
          <InputFeedback variant='error'>{errors.email?.message}</InputFeedback>
        </div>

        <AnimatePresence initial={false}>
          {shouldShowPasswordFields ? (
            <motion.div
              animate={{ opacity: 1, y: 0, height: "auto" }}
              className='flex w-full flex-col gap-4'
              exit={{ opacity: 0, y: -8, height: 0 }}
              initial={{ opacity: 0, y: -8, height: 0 }}
              key='password-fields'
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className='flex w-full flex-col gap-2'>
                <Label htmlFor='password'>Senha</Label>
                <Input
                  aria-invalid={Boolean(errors.password)}
                  id='password'
                  placeholder='***********'
                  type='password'
                  {...register("password")}
                />
                <InputFeedback variant='error'>
                  {errors.password?.message}
                </InputFeedback>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Button
          className='mt-4 w-full py-3 font-medium font-sans text-xs'
          disabled={!canLogin}
          type='submit'
        >
          {isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Processando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>

        <p className='font-sans text-muted-foreground text-xs'>
          Não possui acesso?{" "}
          <Link
            className='font-bold text-primary hover:underline'
            to='/sign-up'
          >
            Fazer Cadastro
          </Link>
        </p>
      </form>
    </div>
  )
}
