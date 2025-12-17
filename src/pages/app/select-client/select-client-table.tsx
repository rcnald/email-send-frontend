import {
  flexRender,
  type Header,
  type Table as TableType,
} from "@tanstack/react-table"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import type { ComponentProps } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type SelectClientTableItem = {
  id: string
  name: string
  CNPJ: string
  accountant: {
    name: string
    email: string
  }
  status: "sent" | "not_send"
}

export interface SelectClientTableProps extends ComponentProps<"table"> {
  table: TableType<SelectClientTableItem>
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

export const SelectClientsTable = ({
  table,
  ...props
}: SelectClientTableProps) => {
  const defineContent = (header: Header<SelectClientTableItem, unknown>) => {
    if (header.isPlaceholder) return null

    const headerCanBeSorted = header.column.getCanSort()

    if (headerCanBeSorted) {
      return (
        <button
          className='flex h-full w-full cursor-pointer select-none items-center justify-between gap-2'
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

  const hasRows = table.getRowModel().rows.length > 0

  return (
    <Table className='table-auto' {...props}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
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
      <TableBody>
        {hasRows ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              data-state={row.getIsSelected() && "selected"}
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell className='last:py-0' key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              className='h-24 text-center'
              colSpan={table.getVisibleLeafColumns().length}
            >
              Sem resultados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
