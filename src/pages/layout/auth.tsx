import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { getProfile } from "@/api/get-profile"
import signBackground from "@/assets/sign-background.png"
import signBackgroundLight from "@/assets/sign-background-light.png"
import signBlur from "@/assets/sign-blur.svg"
import signFade from "@/assets/sign-fade.svg"
import signInBackground from "@/assets/sign-in-background.png"
import signInBackgroundLight from "@/assets/sign-in-background-light.png"
import signUpBackground from "@/assets/sign-up-background.png"
import signUpBackgroundLight from "@/assets/sign-up-background-light.png"
import { LightingIcon } from "@/components/icons/lighting"
import { api, setupResponseInterceptor } from "@/lib/axios"

export const AuthLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isLoginPage = location.pathname === "/sign-in"
  const isRegisterPage = location.pathname === "/sign-up"
  const isRootPath = location.pathname === "/"

  const { isLoading, isError, isSuccess } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    enabled: isRootPath,
    retry: false,
  })

  useEffect(() => {
    const interceptorId = setupResponseInterceptor(api, navigate)

    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  if (isRootPath && isLoading) return null

  if (isRootPath) {
    if (isError) {
      return <Navigate replace to='/sign-in' />
    }
    return <Navigate replace to='/upload' />
  }

  if (isLoginPage && isSuccess) {
    return <Navigate replace to='/upload' />
  }

  return (
    <div className='relative flex min-h-screen border-gradient-inner text-foreground md:border-gradient md:border-gradient-tertiary md:p-4'>
      <img
        alt='Textura geometrica cinza com desfoque suave'
        className='absolute top-0 left-0 h-full'
        src={signFade}
      />
      <img
        alt='Brilho vermelho desfocado no canto superior direito'
        className='absolute top-0 right-0 h-full'
        src={signBlur}
      />

      <div className='relative hidden w-full flex-1 items-end justify-center border-gradient border-gradient-transparent md:flex'>
        <div className='pointer-events-none absolute -inset-4 right-0 -z-2 bg-linear-(--auth-side-bg-gradient) dark:hidden' />
        <img
          alt={
            isRegisterPage
              ? "Pessoa em terno com a mao no bolso em fundo escuro"
              : "Pessoa segurando um envelope lacrado em fundo escuro"
          }
          className='absolute inset-0 -z-1 hidden h-full w-full object-fill dark:block'
          src={isRegisterPage ? signUpBackground : signInBackground}
        />
        <img
          alt={
            isRegisterPage
              ? "Pessoa em terno com a mao no bolso em tom vermelho"
              : "Pessoa segurando um envelope lacrado em tom vermelho"
          }
          className='absolute inset-0 -z-1 block h-full w-full object-fill dark:hidden'
          src={isRegisterPage ? signUpBackgroundLight : signInBackgroundLight}
        />
        <div className='m-10 flex w-full max-w-135 flex-col gap-4'>
          <div className='flex w-fit items-center gap-2 rounded-sm bg-badge-text/70 p-0.5 dark:bg-muted'>
            <span className='flex items-center gap-1 rounded-[6px] border border-sidebar-ring/20 bg-badge-bg px-2 py-1 font-bold font-mono text-[10px] text-primary uppercase shadow-(--badge-shadow)'>
              <LightingIcon />
              <span className='whitespace-nowrap'>Tempo Real</span>
            </span>
            <span className='mr-2 font-sans text-[10px] text-muted dark:text-muted-foreground'>
              Monitore seus envios instantaneamente.
            </span>
          </div>
          <h1 className='font-jakarta font-semibold text-2xl text-muted dark:text-foreground'>
            Sua Plataforma Centralizada <br /> para Envio de Documentos Fiscais
          </h1>
          <p className='font-sans text-muted/60 text-xs dark:text-muted-foreground'>
            Gerencie sua base de clientes e contadores, padronize o envio <br />{" "}
            de arquivos zip automatizados.
          </p>
        </div>
      </div>

      <div className='relative flex w-full flex-1 items-center justify-center p-4'>
        <img
          alt='Gradiente escuro com pontos e grade vermelha no canto superior'
          className='absolute inset-0 -z-50 hidden h-full w-full object-cover dark:block'
          src={signBackground}
        />
        <img
          alt='Gradiente claro com pontos e grade vermelha no canto superior'
          className='absolute inset-0 -z-50 block h-full w-full object-cover dark:hidden'
          src={signBackgroundLight}
        />
        <Outlet />
      </div>
    </div>
  )
}
