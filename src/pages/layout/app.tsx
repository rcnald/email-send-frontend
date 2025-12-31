import { isAxiosError } from "axios"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import { api } from "@/lib/axios"
import { FileStepper } from "../../components/file-stepper"

export const AppLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status
          const code = error.response?.data.code

          // SE TOKEN EXPIROU
          if (status === 401 && code === "UNAUTHORIZED") {
            try {
              // 2. TENTA O REFRESH (o back-end lê o refreshToken do cookie automaticamente)
              await api.patch("/token/refresh") // Ajuste o método e rota para o seu caso

              // Se deu certo, o back enviou um novo accessToken no cookie.
              // Agora basta repetir a requisição que deu erro.
              return api.request(error.config)
            } catch {
              navigate("/sign-in", { replace: true })
            }
          }
        }
        return Promise.reject(error)
      }
    )

    return () => api.interceptors.response.eject(interceptorId)
  }, [navigate])

  return (
    <div className='grid min-h-screen w-full grid-cols-1 grid-rows-[200px_1fr] flex-col place-items-center items-center justify-center gap-10 p-4'>
      <div className='w-full max-w-100 gap-10'>
        <FileStepper />
      </div>
      <Outlet />
    </div>
  )
}
