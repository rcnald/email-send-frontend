import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import type { ApiErrorData } from "@/api/@types/error"
import { signUp } from "@/api/sign-up"
import { EmailIcon } from "@/components/icons/email"
import { Button } from "@/components/ui/button"
import { Input, InputFeedback } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getApiErrorMessages } from "@/lib/axios"

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, { error: "Nome deve ter pelo menos 3 caracteres" })
      .max(30, { error: "Nome deve ter no máximo 30 caracteres" }),
    email: z.email("Endereço de email inválido"),
    password: z
      .string()
      .min(6, { error: "Senha deve ter pelo menos 6 caracteres" })
      .max(100, { error: "Senha deve ter no máximo 100 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    error: "As senhas precisam ser iguais",
    path: ["confirmPassword"],
  })

type SignUpSchema = z.infer<typeof signUpSchema>

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    setFocus,
    watch,
    formState: { errors, isValid },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const navigate = useNavigate()

  const emailValue = watch("email").trim()
  const shouldShowPasswordFields = !errors.email && emailValue.length > 0

  const { mutateAsync: registerHelper, isPending } = useMutation({
    mutationFn: signUp,
    onError: (error: AxiosError<ApiErrorData>) => {
      const messages = getApiErrorMessages(error)

      for (const message of messages) {
        toast.error(message)
      }
    },
    onSuccess(_, variables) {
      toast.success(
        "Cadastro realizado com sucesso! Faça login para continuar."
      )
      navigate(`/sign-in?email=${variables.email}`)
    },
  })

  const canRegister = isValid && !isPending

  const onSubmit = async ({ email, name, password }: SignUpSchema) => {
    await registerHelper({ email, name, password })
  }

  useEffect(() => {
    setFocus("name")
  }, [setFocus])

  return (
    <div className='relative flex w-full max-w-[335px] flex-col items-center gap-8'>
      <div className='flex flex-col items-center gap-8'>
        <div className='flex w-fit rounded-sm border-gradient bg-linear-(--primary-gradient) p-2'>
          <EmailIcon className='text-2xl text-pink-start' />
        </div>
        <div className='flex flex-col items-center gap-2'>
          <h1 className='text-center font-jakarta font-semibol text-xl sm:text-[32px]'>
            Comece a Otimizar Seus Envios Hoje
          </h1>
          <p className='text-center font-sans text-muted-foreground text-xs'>
            Cadastre-se em segundos e tenha controle total sobre seus clientes e
            contadores desde o primeiro clique.
          </p>
        </div>
      </div>

      <form
        className='flex w-full flex-col items-center gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex w-full flex-col gap-2'>
          <Label htmlFor='name'>Nome</Label>
          <Input
            aria-invalid={Boolean(errors.name)}
            id='name'
            placeholder='Ronaldo'
            {...register("name")}
          />
          <InputFeedback variant='error'>{errors.name?.message}</InputFeedback>
        </div>

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

              <div className='flex w-full flex-col gap-2'>
                <Label htmlFor='confirmPassword'>Confirme sua Senha</Label>
                <Input
                  aria-invalid={Boolean(errors.confirmPassword)}
                  id='confirmPassword'
                  placeholder='***********'
                  type='password'
                  {...register("confirmPassword")}
                />
                <InputFeedback variant='error'>
                  {errors.confirmPassword?.message}
                </InputFeedback>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Button
          className='mt-4 w-full py-3 font-medium font-sans text-xs'
          disabled={!canRegister}
          type='submit'
        >
          {isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Processando...
            </>
          ) : (
            "Cadastrar"
          )}
        </Button>

        <p className='font-sans text-muted-foreground text-xs'>
          Já possui uma conta?{" "}
          <Link
            className='font-bold text-primary hover:underline'
            to='/sign-in'
          >
            Fazer Login
          </Link>
        </p>
      </form>
    </div>
  )
}
