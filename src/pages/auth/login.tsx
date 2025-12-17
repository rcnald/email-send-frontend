import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input, InputFeedback } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

type LoginSchema = z.infer<typeof loginSchema>

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  const canLogin = isValid && !isSubmitting

  const onSubmit = async (_data: LoginSchema) => {
    // TODO: Implementar login com mutation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("Login simulado concluído!")
  }

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
            to='/auth/register'
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
          {isSubmitting ? (
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
