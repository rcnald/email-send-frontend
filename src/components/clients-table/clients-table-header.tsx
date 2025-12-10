import {
  flexRender,
  type Header,
  type HeaderGroup,
} from "@tanstack/react-table"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { TableHead, TableHeader, TableRow } from "../ui/table"

export interface ClientsTableHeaderProps<TData = unknown> {
  tableHeaderGroups: HeaderGroup<TData>[]
}

const SORT_DIRECTION_ICONS = {
  asc: (
    <ChevronUpIcon
      aria-hidden='true'
      className='shrink-0 opacity-60'
      size={16}
    />
  ),
  desc: (
    <ChevronDownIcon
      aria-hidden='true'
      className='shrink-0 opacity-60'
      size={16}
    />
  ),
}

const SortIcon = ({ direction }: { direction: false | "asc" | "desc" }) => {
  if (!direction) return null

  return SORT_DIRECTION_ICONS[direction]
}

export const ClientsTableHeader = <TData,>({
  tableHeaderGroups,
}: ClientsTableHeaderProps<TData>) => {
  const defineContent = (header: Header<TData, unknown>) => {
    if (header.isPlaceholder) return null

    const headerCanBeSorted = header.column.getCanSort()

    if (headerCanBeSorted) {
      return (
        <button
          className={
            "flex h-full w-full cursor-pointer select-none items-center justify-between gap-2"
          }
          onClick={header.column.getToggleSortingHandler()}
          type='button'
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          <SortIcon direction={header.column.getIsSorted()} />
        </button>
      )
    }

    return flexRender(header.column.columnDef.header, header.getContext())
  }

  return (
    <TableHeader>
      {tableHeaderGroups.map((headerGroup) => (
        <TableRow className='hover:bg-transparent' key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const headerContent = defineContent(header)

            return (
              <TableHead
                className='h-11'
                key={header.id}
                style={{ width: `${header.getSize()}px` }}
              >
                {headerContent}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}
