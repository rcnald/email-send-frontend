import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { Navigate, Outlet, useNavigate } from "react-router"
import { getProfile } from "@/api/get-profile"
import { Sidebar } from "@/components/sidebar"
import { api, setupResponseInterceptor } from "@/lib/axios"

export const AppLayout = () => {
  const navigate = useNavigate()

  const { isLoading, isError, data } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    retry: false,
  })

  useEffect(() => {
    const interceptorId = setupResponseInterceptor(api, navigate)

    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  if (isLoading) return null

  if (isError || !data) return <Navigate replace to='/sign-in' />

  return (
    <div className='min-h-screen bg-background'>
      <div className='mx-auto flex min-h-screen'>
        <Sidebar />
        <main className='w-full max-w-[1440px] flex-1 overflow-x-hidden p-4 sm:p-8 lg:p-10'>
          <div className='mx-auto flex w-full max-w-[980px] justify-center'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
