import { CircleXIcon, ListFilterIcon } from "lucide-react"
import { useId, useRef } from "react"
import { cn } from "@/lib/utils"
import { Input } from "../ui/input"

export interface ClientsTableFiltersProps {
  filterValue?: string
  setFilterValue?: (value: string) => void
}

export const ClientsTableFilters = ({
  filterValue = "",
  setFilterValue,
}: ClientsTableFiltersProps) => {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const hasFilterValue = Boolean(filterValue)

  return (
    <>
      <Input
        aria-label='Filter by name or email'
        className={cn("peer min-w-60 ps-9", hasFilterValue && "pe-9")}
        id={`${id}-input`}
        onChange={(e) => setFilterValue?.(e.target.value)}
        placeholder='Filter by name or email...'
        ref={inputRef}
        type='text'
        value={filterValue}
      />

      <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50'>
        <ListFilterIcon aria-hidden='true' size={16} />
      </div>

      {hasFilterValue ? (
        <button
          aria-label='Clear filter'
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
    </>
  )
}
