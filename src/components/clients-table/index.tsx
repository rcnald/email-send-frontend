import { useQuery } from "@tanstack/react-query"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { useState } from "react"
import { fetchClients } from "@/api/fetch-clients"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table } from "@/components/ui/table"
import { maskCNPJ } from "@/lib/utils"
import { useClientStore } from "@/store/client-store"
import { ClientsTableAddButton } from "./clients-table-add-button"
import { ClientsTableBody } from "./clients-table-body"
import { ClientsTableDeleteButton } from "./clients-table-delete-button"
import { ClientsTableFilters } from "./clients-table-filters"
import { ClientsTableHeader } from "./clients-table-header"

type Item = {
  id: string
  name: string
  CNPJ: string
  accountant: {
    name: string
    email: string
  }
  status: "sent" | "not_send"
}

const STATUS_OPTIONS = {
  sent: "Enviado",
  not_sent: "Não Enviado",
}

const multiColumnFilterFn: FilterFn<Item> = (row, _, filterValue) => {
  const searchableRowContent = row.original.name.toLowerCase()

  const searchTerm = (filterValue ?? "").toLowerCase()

  return searchableRowContent.includes(searchTerm)
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
    header: "Nome",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue("name")}</div>
    ),
    size: 180,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "CNPJ",
    accessorKey: "CNPJ",
    cell: ({ row }) => maskCNPJ(row.getValue("CNPJ")),
    size: 220,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("status") === "not_sent" ? "destructive" : "default"
        }
      >
        {STATUS_OPTIONS[row.getValue("status") as keyof typeof STATUS_OPTIONS]}
      </Badge>
    ),
    size: 100,
  },
  {
    header: "Contador",
    accessorKey: "accountant.name",
    cell: ({ row }) => <div>{row.original.accountant.name}</div>,
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => <div>{row.original.accountant.email}</div>,
    size: 180,
  },
]

export function ClientsTable() {
  const { addClient, clearClient } = useClientStore((state) => state.actions)
  const client = useClientStore((state) => state.client)

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() =>
    client ? { [client.id]: true } : {}
  )
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ])

  const { data: clientsData } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  })

  const handleRowSelection: OnChangeFn<RowSelectionState> = (
    updaterOrValue
  ) => {
    setRowSelection(updaterOrValue)

    const rowSelectionValue =
      typeof updaterOrValue === "function"
        ? updaterOrValue(rowSelection)
        : updaterOrValue

    clearClient()

    Object.keys(rowSelectionValue).forEach((key) => {
      const selectedClient = clientsData?.clients.find(
        (clientData) => clientData.id === key
      )

      addClient({
        id: key,
        name: selectedClient?.name ?? "",
        CNPJ: selectedClient?.CNPJ ?? "",
        accountant: {
          name: selectedClient?.accountant.name ?? "",
          email: selectedClient?.accountant.email ?? "",
        },
      })
    })
  }

  const table = useReactTable({
    data: clientsData?.clients ?? [],
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
    getRowId: (row) => row.id,
    onRowSelectionChange: handleRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  const isRowSelected = table.getSelectedRowModel().rows.length > 0

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <ClientsTableFilters
            className='relative'
            filterValue={table.getColumn("name")?.getFilterValue() as string}
            setFilterValue={table.getColumn("name")?.setFilterValue}
          />
        </div>
        <div className='flex items-center gap-3'>
          {isRowSelected ? (
            <ClientsTableDeleteButton onDelete={() => null} />
          ) : null}

          <ClientsTableAddButton />
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
