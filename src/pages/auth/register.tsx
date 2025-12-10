import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2 } from "lucide-react" // Importei o Loader2 e Check do Lucide
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input, InputFeedback } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

type RegisterSchema = z.infer<typeof registerSchema>

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }, // Adicionado isSubmitting para o loading
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  })

  // Simulação de delay para a mutation
  const onSubmit = async (_data: RegisterSchema) => {
    // TODO: Implementar registro com mutation real (e.g., react-query/tanstack query)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    alert("Cadastro simulado concluído!")
  }

  return (
    <div className='relative min-h-screen bg-background text-foreground'>
      <div
        aria-hidden='true'
        className='absolute inset-0 bg-[url("/hermes.png")] bg-center bg-cover'
        style={{ filter: "var(--hermes-filter)" }}
      />
      <div className='absolute inset-0 bg-gradient-to-br from-background/50 via-background/50 to-background/50 backdrop-blur-sm' />

      <div className='relative z-10 mx-auto flex min-h-screen w-full items-center justify-start px-4 py-10 sm:px-40'>
        <div className='w-full max-w-md rounded-xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur sm:p-8'>
          <div className='mb-8'>
            <div className='mb-3 flex items-center gap-2'>
              <span className='text-2xl sm:text-3xl'>👋</span>
              <h2 className='font-semibold text-xl sm:text-2xl'>
                Bem-vindo ao ******!
              </h2>
            </div>
            <p className='text-muted-foreground text-sm'>
              Já tem uma conta?{" "}
              <Link
                className='font-medium text-primary hover:underline'
                to='/login'
              >
                Entrar
              </Link>
            </p>
          </div>

          <form className='' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-2'>
              <Label htmlFor='name'>Nome</Label>
              <Input
                aria-invalid={!!errors.name}
                className='border-border bg-background/70 text-foreground'
                id='name'
                placeholder='Ronaldo'
                {...register("name")}
              />
              <InputFeedback variant='error'>
                {errors.name?.message}
              </InputFeedback>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                aria-invalid={!!errors.email}
                className='border-border bg-background/70 text-foreground'
                id='email'
                placeholder='ronaldo@example.com'
                type='email'
                {...register("email")}
              />
              <InputFeedback variant='error'>
                {errors.email?.message}
              </InputFeedback>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Senha</Label>
              <Input
                aria-invalid={!!errors.password}
                className='border-border bg-background/70 text-foreground'
                id='password'
                placeholder='***********'
                type='password'
                {...register("password")}
              />
              <InputFeedback
                className='flex'
                variant={errors.password ? "error" : "success"}
                when={!!errors.password || (isValid && !errors.password)}
              >
                {errors.password ? (
                  errors.password.message
                ) : (
                  <>
                    <Check className='mr-1 h-4 w-4' />
                    Senha válida
                  </>
                )}
              </InputFeedback>
            </div>

            <Button
              className='mt-6 w-full'
              disabled={!isValid || isSubmitting}
              type='submit'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Processando...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>

            <p className='pt-4 text-center text-muted-foreground text-xs'>
              Ao se inscrever, você concorda com nossos{" "}
              <Link className='underline hover:text-foreground' to='/terms'>
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link className='underline hover:text-foreground' to='/privacy'>
                Política de Privacidade
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
