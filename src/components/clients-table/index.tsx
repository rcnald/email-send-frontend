import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ClientsTableBody } from "./clients-table-body"
import { ClientsTableDeleteButton } from "./clients-table-delete-button"
import { ClientsTableFilters } from "./clients-table-filters"
import { ClientsTableHeader } from "./clients-table-header"

type Item = {
  id: string
  name: string
  email: string
  location: string
  flag: string
  status: "Active" | "Inactive" | "Pending"
  balance: number
}

const multiColumnFilterFn: FilterFn<Item> = (row, _, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.email}`.toLowerCase()

  const searchTerm = (filterValue ?? "").toLowerCase()

  return searchableRowContent.includes(searchTerm)
}

const statusFilterFn: FilterFn<Item> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true

  const status = row.getValue(columnId) as string

  return filterValue.includes(status)
}

const columns: ColumnDef<Item>[] = [
  {
    id: "select",
    header: () => <span className='sr-only'>Selecionar</span>,
    cell: ({ row }) => (
      <Checkbox
        aria-label='Selecionar linha'
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue("name")}</div>
    ),
    size: 180,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 220,
  },
  {
    header: "Location",
    accessorKey: "location",
    cell: ({ row }) => (
      <div>
        <span className='text-lg leading-none'>{row.original.flag}</span>{" "}
        {row.getValue("location")}
      </div>
    ),
    size: 180,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.getValue("status") === "Inactive" &&
            "bg-muted-foreground/60 text-primary-foreground"
        )}
      >
        {row.getValue("status")}
      </Badge>
    ),
    size: 100,
    filterFn: statusFilterFn,
  },
  {
    header: "Performance",
    accessorKey: "performance",
  },
  {
    header: "Balance",
    accessorKey: "balance",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("balance"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
    size: 120,
  },
]

export default function Component() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ])

  const [data, setData] = useState<Item[]>([])

  useEffect(() => {
    async function fetchClients() {
      const clientsResponse = await fetch(
        "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/users-01_fertyx.json"
      )
      const clientsData = await clientsResponse.json()

      setData(clientsData)
    }

    fetchClients()
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableMultiRowSelection: false,
    state: {
      sorting,
      columnFilters,
    },
  })

  const isRowSelected = table.getSelectedRowModel().rows.length > 0

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const updatedData = data.filter(
      (item) => !selectedRows.some((row) => row.original.id === item.id)
    )
    setData(updatedData)
    table.resetRowSelection()
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <ClientsTableFilters
              filterValue={table.getColumn("name")?.getFilterValue() as string}
              setFilterValue={table.getColumn("name")?.setFilterValue}
            />
          </div>
        </div>
        <div className='flex items-center gap-3'>
          {isRowSelected ? (
            <ClientsTableDeleteButton onDelete={handleDeleteRows} />
          ) : null}

          <Button className='ml-auto' variant='outline'>
            <PlusIcon
              aria-hidden='true'
              className='-ms-1 opacity-60'
              size={16}
            />
            Add user
          </Button>
        </div>
      </div>

      <div className='overflow-hidden rounded-md border bg-background'>
        <Table className='table-auto'>
          <ClientsTableHeader tableHeaderGroups={table.getHeaderGroups()} />
          <ClientsTableBody
            columnsQuantity={table.getVisibleLeafColumns().length}
            tableRowModel={table.getRowModel()}
          />
        </Table>
      </div>
    </div>
  )
}
