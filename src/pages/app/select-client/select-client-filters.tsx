import { CircleXIcon, ListFilterIcon } from "lucide-react"
import { type ComponentProps, useId, useRef } from "react"
import { cn } from "@/lib/utils"
import { Input } from "../../../components/ui/input"

export type ClientsTableFiltersProps = {
  filterValue?: string
  setFilterValue?: (value: string) => void
} & ComponentProps<"div">

export const ClientsTableFilters = ({
  filterValue = "",
  setFilterValue,
  ...props
}: ClientsTableFiltersProps) => {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const hasFilterValue = Boolean(filterValue)

  return (
    <div {...props}>
      <Input
        aria-label='Filtrar por nome'
        className={cn("peer min-w-60 ps-9", hasFilterValue && "pe-9")}
        id={`${id}-input`}
        onChange={(e) => setFilterValue?.(e.target.value)}
        placeholder='Filtrar por nome'
        ref={inputRef}
        type='text'
        value={filterValue}
      />

      <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50'>
        <ListFilterIcon aria-hidden='true' size={16} />
      </div>

      {hasFilterValue ? (
        <button
          aria-label='Limpar filtros'
          className='absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
          onClick={() => {
            setFilterValue?.("")

            if (inputRef.current) {
              inputRef.current.focus()
            }
          }}
          type='button'
        >
          <CircleXIcon aria-hidden='true' size={16} />
        </button>
      ) : null}
    </div>
  )
}
