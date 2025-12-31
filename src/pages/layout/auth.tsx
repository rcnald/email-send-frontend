import { Outlet, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export const AuthLayout = () => {
  const location = useLocation()

  const isLoginPage = location.pathname === "/sign-in"
  const isRegisterPage = location.pathname === "/sign-up"

  return (
    <div className='relative min-h-screen bg-background text-foreground'>
      <div
        aria-hidden='true'
        className={cn(
          "absolute inset-0 bg-center bg-cover",
          isLoginPage && "bg-[url('/woman.png')]",
          isRegisterPage && "bg-[url('/hermes.png')]"
        )}
        style={{
          filter: "var(--hermes-filter)",
        }}
      />
      <div className='absolute inset-0 bg-gradient-to-br from-background/50 via-background/50 to-background/50 backdrop-blur-sm' />

      <div className='relative z-10 mx-auto flex min-h-screen w-full items-center justify-end px-4 py-10 sm:px-40'>
        <div className='w-full max-w-md rounded-xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur sm:p-8'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
