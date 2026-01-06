import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { Navigate, Outlet, useNavigate } from "react-router"
import { getProfile } from "@/api/get-profile"
import { api, setupResponseInterceptor } from "@/lib/axios"
import { FileStepper } from "../../components/file-stepper"

export const AppLayout = () => {
  const navigate = useNavigate()

  const { isLoading, isError, data } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    retry: false,
  })

  useEffect(() => {
    const interceptorId = setupResponseInterceptor(api, navigate)

    return () => api.interceptors.response.eject(interceptorId)
  }, [navigate])

  if (isLoading) return null

  if (isError || !data) return <Navigate replace to='/sign-in' />

  return (
    <div className='grid min-h-screen w-full grid-cols-1 grid-rows-[200px_1fr] flex-col place-items-center items-center justify-center gap-10 p-4'>
      <div className='w-full max-w-100 gap-10'>
        <FileStepper />
      </div>
      <Outlet />
    </div>
  )
}
