import { flexRender, type RowModel } from "@tanstack/react-table"
import { TableBody, TableCell, TableRow } from "../ui/table"

export type ClientsTableBodyProps<TData> = {
  tableRowModel: RowModel<TData>
  columnsQuantity: number
}

export const ClientsTableBody = <TData,>({
  tableRowModel,
  columnsQuantity,
}: ClientsTableBodyProps<TData>) => {
  const hasRows = tableRowModel.rows.length > 0

  return (
    <TableBody>
      {hasRows ? (
        tableRowModel.rows.map((row) => (
          <TableRow data-state={row.getIsSelected() && "selected"} key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell className='last:py-0' key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell className='h-24 text-center' colSpan={columnsQuantity}>
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
