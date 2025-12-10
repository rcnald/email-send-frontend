import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2 } from "lucide-react" // Importei o Loader2 e Check do Lucide
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
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

  // Corrigindo a verificação de validade da senha individualmente (para a mensagem de "Password is valid")
  // O estilo foi invertido: o background agora é o lado direito
  return (
    <div className='flex min-h-screen'>
      {/* Right Side - Visual Effect (Agora é o fundo de tela inteira) */}
      <div className='relative flex-1 overflow-hidden bg-background-dark'>
        {/* Background Animado (Mosaico Abstrato) - Mantive sua lógica de fundo */}
        <div className='absolute inset-0'>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              className='absolute h-2 w-2 animate-pulse rounded-full'
              key={`particle-${i}-${Math.random()}`}
              style={{
                background: ["#ff00ff", "#00ffff", "#ffff00"][i % 3],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Logo/Nome do App no Fundo */}
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='text-center text-white'>
            <h1 className='font-bold text-7xl tracking-tight md:text-8xl lg:text-9xl'>
              Modyfi
            </h1>
            <p className='text-xl opacity-90 md:text-2xl'>
              Send emails simply and efficiently
            </p>
          </div>
        </div>
      </div>

      {/* Left Side - Form Card (Sobreposto e Escuro) */}
      <div className='absolute inset-0 flex items-center justify-center p-4 lg:w-auto lg:justify-start'>
        <div className='w-full max-w-sm rounded-xl bg-gray-900/95 p-8 shadow-2xl backdrop-blur-sm sm:max-w-md'>
          {/* Header */}
          <div className='mb-8 text-white'>
            <div className='mb-4 flex items-center'>
              {/* O Ícone 👋 e o Título */}
              <h1 className='mr-2 font-bold text-3xl'>👋</h1>
              <h2 className='font-semibold text-2xl'>Welcome to Modyfi!</h2>
            </div>

            <p className='text-gray-400 text-sm'>
              Already have an account?{" "}
              <Link
                className='font-medium text-primary hover:underline'
                to='/login'
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Google Sign Up */}
          <Button
            className='mb-6 w-full bg-white text-gray-900 hover:bg-gray-100'
            type='button'
            variant='outline'
          >
            <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
              <title>Google Icon</title>
              {/* Paths do Google SVG... */}
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#FBBC05'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
            </svg>
            Sign up with Google
          </Button>

          <div className='relative mb-6'>
            <div className='absolute inset-0 flex items-center'>
              {/* Linha divisória branca no fundo escuro */}
              <span className='w-full border-gray-700 border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              {/* Fundo do span deve ser o mesmo do card (bg-gray-900) */}
              <span className='bg-gray-900/95 px-2 text-gray-500'>OR</span>
            </div>
          </div>

          {/* Form */}
          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            {/* Campo Nome */}
            <div className='space-y-2'>
              <Label className='text-gray-300' htmlFor='name'>
                Name
              </Label>
              <Input
                className='border-gray-700 bg-gray-800 text-white'
                id='name'
                placeholder='Lidya'
                {...register("name")}
              />
              {errors.name && (
                <p className='text-red-500 text-sm'>{errors.name.message}</p>
              )}
            </div>

            {/* Campo Email */}
            <div className='space-y-2'>
              <Label className='text-gray-300' htmlFor='email'>
                Email
              </Label>
              <Input
                className='border-gray-700 bg-gray-800 text-white'
                id='email'
                placeholder='lidya@refero.design'
                type='email'
                {...register("email")}
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email.message}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div className='space-y-2'>
              <Label className='text-gray-300' htmlFor='password'>
                Password
              </Label>
              <Input
                className='border-gray-700 bg-gray-800 text-white'
                id='password'
                placeholder='***********'
                type='password'
                {...register("password")}
              />
              {errors.password && (
                <p className='text-red-500 text-sm'>
                  {errors.password.message}
                </p>
              )}
              {/* Mensagem de sucesso da senha (se for válida e não houver outros erros) */}
              {isValid && !errors.password && (
                <p className='flex items-center text-green-500 text-sm'>
                  <Check className='mr-1 h-4 w-4' />
                  Password is valid
                </p>
              )}
            </div>

            {/* Botão de Envio */}
            <Button
              className='mt-6 w-full bg-gray-700 text-white hover:bg-gray-600'
              disabled={!isValid || isSubmitting}
              type='submit' // Desabilita se não for válido ou estiver enviando
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Termos de Uso */}
            <p className='pt-4 text-center text-gray-500 text-xs'>
              By signing up you agree to our{" "}
              <Link className='underline hover:text-white' to='/terms'>
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link className='underline hover:text-white' to='/privacy'>
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
