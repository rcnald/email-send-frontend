import { useMutation } from "@tanstack/react-query"
import {
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Send,
  Upload,
  User,
} from "lucide-react"
import { motion } from "motion/react"
import {
  type ComponentProps,
  type ElementType,
  type MouseEvent,
  useEffect,
  useState,
} from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { logout } from "@/api/logout"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useClientStore } from "@/store/client-store"
import { useFileStore } from "@/store/file-store"

type SidebarProps = ComponentProps<"aside">

interface WorkflowItem {
  icon: ElementType
  label: string
  pathname: "/upload" | "/select-client" | "/resume"
  canNavigate: boolean
}

const getWorkflowItemStateClassName = (
  isDisabled: boolean,
  isActive: boolean
) => {
  if (isDisabled) {
    return "pointer-events-none text-sidebar-foreground/45"
  }

  if (isActive) {
    return "bg-sidebar-accent text-sidebar-primary"
  }

  return "text-sidebar-foreground/85 hover:bg-sidebar-accent/45 hover:text-sidebar-foreground"
}

const DESKTOP_BREAKPOINT = "(min-width: 640px)"

function useSidebarResponsiveState() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT)

    const syncViewport = () => {
      const desktop = mediaQuery.matches
      setIsDesktop(desktop)
      setIsCollapsed(!desktop)
    }

    syncViewport()
    mediaQuery.addEventListener("change", syncViewport)

    return () => {
      mediaQuery.removeEventListener("change", syncViewport)
    }
  }, [])

  const sidebarAnimation = isDesktop
    ? {
        paddingBottom: 16,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 16,
        width: isCollapsed ? 60 : 272,
        x: 0,
      }
    : {
        paddingBottom: 16,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 16,
        width: isCollapsed ? 60 : 272,
        x: 0,
      }

  return {
    isCollapsed,
    isDesktop,
    setIsCollapsed,
    sidebarAnimation,
  }
}

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isCollapsed, isDesktop, setIsCollapsed, sidebarAnimation } =
    useSidebarResponsiveState()

  const hasFilesToProceed = useFileStore(
    (state) => state.uploadedFiles.length > 0
  )
  const clearUploadedFiles = useFileStore(
    (state) => state.actions.clearUploadedFiles
  )

  const hasClientToProceed = useClientStore((state) => Boolean(state.client))
  const clearClient = useClientStore((state) => state.actions.clearClient)

  const { mutateAsync: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUploadedFiles()
      clearClient()
      navigate("/sign-in")
    },
  })

  const workflowItems: WorkflowItem[] = [
    {
      icon: Upload,
      label: "Anexar Arquivos",
      pathname: "/upload",
      canNavigate: true,
    },
    {
      icon: User,
      label: "Selecionar Cliente",
      pathname: "/select-client",
      canNavigate: hasFilesToProceed,
    },
    {
      icon: Send,
      label: "Resumo",
      pathname: "/resume",
      canNavigate: hasFilesToProceed && hasClientToProceed,
    },
  ]

  const handleLogout = async () => {
    await logoutMutation()
  }

  const handleToggleCollapsed = () => {
    setIsCollapsed((state) => !state)
  }

  let sidebarPositionClassName = isCollapsed
    ? "sticky top-0 z-auto"
    : "fixed inset-y-0 left-0 z-40"

  if (isDesktop) {
    sidebarPositionClassName = "sticky top-0 z-auto"
  }

  return (
    <motion.aside
      animate={sidebarAnimation}
      className={cn(
        "flex h-screen shrink-0 flex-col overflow-hidden border-sidebar-border border-r bg-sidebar text-sidebar-foreground",
        sidebarPositionClassName,
        className
      )}
      initial={false}
      // onAnimationComplete={handleToggleCollapsed}
      transition={{
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1],
        type: "tween",
      }}
    >
      <div className='mb-4 flex justify-center sm:justify-end'>
        <Button
          aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
          className='h-9 w-9 p-0 text-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-primary'
          onClick={handleToggleCollapsed}
          type='button'
          variant='ghost'
        >
          {isCollapsed ? (
            <ChevronsRight aria-hidden='true' size={16} />
          ) : (
            <ChevronsLeft aria-hidden='true' size={16} />
          )}
          <span className='sr-only'>
            {isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
          </span>
        </Button>
      </div>

      <div className='border-sidebar-border/80 border-t pt-5'>
        <p className='flex h-7'>
          <span
            className={cn(
              "font-semibold text-[11px] text-sidebar-foreground/60 uppercase tracking-wide",
              isCollapsed && "sr-only"
            )}
          >
            Workflow
          </span>
        </p>

        <nav aria-label='Workflow steps' className='flex flex-col gap-2'>
          {workflowItems.map((item) => {
            const isActive = pathname === item.pathname
            const isDisabled = !item.canNavigate
            const Icon = item.icon

            const labelAnimation = {
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : "auto",
            }
            const itemStateClassName = getWorkflowItemStateClassName(
              isDisabled,
              isActive
            )

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                aria-disabled={isDisabled ? true : undefined}
                className={cn(
                  "group flex h-11 items-center justify-between gap-3 rounded-lg px-3 font-medium text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                  itemStateClassName
                )}
                key={item.pathname}
                onClick={
                  isDisabled
                    ? (event: MouseEvent<HTMLAnchorElement>) =>
                        event.preventDefault()
                    : undefined
                }
                tabIndex={isDisabled ? -1 : undefined}
                to={item.pathname}
              >
                <span className='flex min-w-0 items-center gap-3'>
                  <span className='flex w-4 shrink-0 justify-center'>
                    <Icon aria-hidden='true' size={16} />
                  </span>
                  <motion.span
                    animate={labelAnimation}
                    className='overflow-hidden whitespace-nowrap'
                    initial={false}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    {item.label}
                  </motion.span>
                </span>
                <motion.span
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  className='flex w-4 shrink-0 justify-center'
                  initial={false}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <ChevronRight
                    aria-hidden='true'
                    className={cn(
                      "transition-transform duration-200",
                      isActive
                        ? "text-sidebar-primary"
                        : "translate-x-0.5 text-sidebar-foreground/45 group-hover:translate-x-1 group-hover:text-sidebar-foreground/70"
                    )}
                    size={16}
                  />
                </motion.span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className='mt-auto border-sidebar-border border-t pt-4'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className={cn(
                "w-full gap-3 px-3 text-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-primary",
                "justify-start"
              )}
              type='button'
              variant='ghost'
            >
              <LogOut aria-hidden='true' size={16} />
              <motion.span
                animate={{
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : "auto",
                }}
                className='overflow-hidden whitespace-nowrap'
                initial={false}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                Sair
              </motion.span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza de que deseja sair?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Você precisará entrar novamente para continuar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <Button asChild variant='destructive'>
                <AlertDialogAction
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                >
                  {isLoggingOut ? "Saindo..." : "Sair"}
                </AlertDialogAction>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.aside>
  )
}
