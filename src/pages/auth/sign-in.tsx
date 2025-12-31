import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import type { ApiErrorData } from "@/api/@types/error"
import { signIn } from "@/api/sign-in"
import { Button } from "@/components/ui/button"
import { Input, InputFeedback } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getApiErrorMessages } from "@/lib/axios"

const signInSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

type SignInSchema = z.infer<typeof signInSchema>

export const SignIn = () => {
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  const email = searchParams.get("email")

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isValid },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: email || "",
    },
  })

  const { mutateAsync: authenticate, isPending } = useMutation({
    mutationFn: signIn,
    onError: (error: AxiosError<ApiErrorData>) => {
      const messages = getApiErrorMessages(error)
      messages.forEach((msg) => {
        toast.error(msg)
      })
    },
    onSuccess() {
      toast.success("Logado com sucesso! Bem-vindo de volta.")
      navigate("/")
    },
  })

  const canLogin = isValid && !isPending

  const onSubmit = async (data: SignInSchema) => {
    await authenticate(data)
  }

  useEffect(() => {
    if (email) {
      return setFocus("password")
    }

    setFocus("email")
  }, [email, setFocus])

  return (
    <>
      <div className='mb-8'>
        <div className='mb-3 flex items-center gap-2'>
          <span className='text-2xl sm:text-3xl'>👋</span>
          <h2 className='font-semibold text-xl sm:text-2xl'>
            Bem-vindo de volta!
          </h2>
        </div>
        <p className='text-muted-foreground text-sm'>
          Não tem uma conta?{" "}
          <Link
            className='font-medium text-primary hover:underline'
            to='/sign-up'
          >
            Cadastre-se
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            aria-invalid={Boolean(errors.email)}
            className='border-border bg-background/70 text-foreground'
            id='email'
            placeholder='ronaldo@example.com'
            type='email'
            {...register("email")}
          />
          <InputFeedback variant='error'>{errors.email?.message}</InputFeedback>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='password'>Senha</Label>
            <Link
              className='font-medium text-primary text-sm hover:underline'
              to='/forgot-password'
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            aria-invalid={Boolean(errors.password)}
            className='border-border bg-background/70 text-foreground'
            id='password'
            placeholder='***********'
            type='password'
            {...register("password")}
          />
          <InputFeedback variant='error'>
            {errors.password?.message}
          </InputFeedback>
        </div>

        <Button className='mt-6 w-full' disabled={!canLogin} type='submit'>
          {isPending ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>

        <p className='pt-4 text-center text-muted-foreground text-xs'>
          Ao entrar, você concorda com nossos{" "}
          <Link className='underline hover:text-foreground' to='/terms'>
            Termos de Uso
          </Link>{" "}
          e{" "}
          <Link className='underline hover:text-foreground' to='/privacy'>
            Política de Privacidade
          </Link>
        </p>
      </form>
    </>
  )
}
