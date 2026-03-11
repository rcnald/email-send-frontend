import { useQuery } from "@tanstack/react-query";
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
	type Table as TableType,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchClients } from "@/api/fetch-clients";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { maskCNPJ } from "@/lib/utils";
import { useClientStore } from "@/store/client-store";
import { useFileStore } from "@/store/file-store";
import { ClientsTableAddButton } from "./select-client-add";
import { ClientsTableDeleteButton } from "./select-client-delete";
import { ClientsTableFilters } from "./select-client-filters";
import {
	SelectClientsTable,
	type SelectClientTableItem,
} from "./select-client-table";

const STATUS_OPTIONS = {
	sent: "Enviado",
	not_sent: "Não Enviado",
};

const multiColumnFilterFn: FilterFn<SelectClientTableItem> = (
	row,
	_,
	filterValue,
) => {
	const searchableRowContent = row.original.name.toLowerCase();

	const searchTerm = (filterValue ?? "").toLowerCase();

	return searchableRowContent.includes(searchTerm);
};

const columns: ColumnDef<SelectClientTableItem>[] = [
	{
		id: "select",
		header: () => <span className="sr-only">Selecionar</span>,
		cell: ({ row }) => (
			<Checkbox
				aria-label="Selecionar linha"
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
			<div className="font-medium">{row.getValue("name")}</div>
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
];

const getPaginationItems = (table: TableType<SelectClientTableItem>) => {
	const pageCount = table.getPageCount();
	const currentPage = table.getState().pagination.pageIndex + 1;

	if (pageCount <= 1) return [1];

	const pages = new Set<number>([1, pageCount, currentPage]);

	if (currentPage > 1) {
		pages.add(currentPage - 1);
	}

	if (currentPage < pageCount) {
		pages.add(currentPage + 1);
	}

	const sortedPages = Array.from(pages).sort((a, b) => a - b);
	const items: Array<number | string> = [];

	for (const page of sortedPages) {
		const previous = items.at(-1);

		if (typeof previous === "number" && page - previous > 1) {
			items.push(`ellipsis-${previous}-${page}`);
		}

		items.push(page);
	}

	return items;
};

export const SelectClientStep = () => {
	const { addClient, clearClient } = useClientStore((state) => state.actions);
	const client = useClientStore((state) => state.client);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = useState<RowSelectionState>(() =>
		client ? { [client.id]: true } : {},
	);
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: "name",
			desc: false,
		},
	]);

	const { data: clientsData, isPending } = useQuery({
		queryKey: ["clients"],
		queryFn: fetchClients,
	});

	const handleRowSelection: OnChangeFn<RowSelectionState> = (
		updaterOrValue,
	) => {
		setRowSelection(updaterOrValue);

		const rowSelectionValue =
			typeof updaterOrValue === "function"
				? updaterOrValue(rowSelection)
				: updaterOrValue;

		clearClient();

		Object.keys(rowSelectionValue).forEach((key) => {
			const selectedClient = clientsData?.clients.find(
				(clientData) => clientData.id === key,
			);

			addClient({
				id: key,
				name: selectedClient?.name ?? "",
				CNPJ: selectedClient?.CNPJ ?? "",
				accountant: {
					name: selectedClient?.accountant.name ?? "",
					email: selectedClient?.accountant.email ?? "",
				},
			});
		});
	};

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
	});

	const isRowSelected = table.getSelectedRowModel().rows.length > 0;
	const totalClientsCount = clientsData?.clients.length ?? 0;
	const currentPageRowsCount = table.getRowModel().rows.length;
	const paginationItems = getPaginationItems(table);

	const navigate = useNavigate();
	const hasSelectedClient = useClientStore((state) => Boolean(state.client));
	const hasFilesToProceed = useFileStore(
		(state) => state.uploadedFiles.length > 0,
	);

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleNextStep = () => {
		if (hasFilesToProceed && hasSelectedClient) {
			navigate("/resume");
		}
	};

	useEffect(() => {
		if (!hasFilesToProceed) {
			navigate("/upload", { replace: true });
		}
	}, [hasFilesToProceed, navigate]);

	return (
		<div className="w-full self-start space-y-6">
			<section className="space-y-2 border-border border-t pt-5">
				<h1 className="font-semibold text-3xl tracking-tight text-foreground">
					Selecionar Clientes
				</h1>
				<p className="text-muted-foreground text-sm">
					Escolha os destinatarios para o envio do lote de documentos fiscais.
				</p>
			</section>

			<section className="space-y-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex flex-1 items-center gap-2">
						<ClientsTableFilters
							className="relative min-w-[280px] flex-1 md:max-w-[420px]"
							filterValue={table.getColumn("name")?.getFilterValue() as string}
							placeholder="Filtrar por nome ou CNPJ..."
							setFilterValue={table.getColumn("name")?.setFilterValue}
						/>
					</div>

					<div className="flex items-center gap-3">
						{isRowSelected ? (
							<ClientsTableDeleteButton onDelete={() => null} />
						) : null}
						<ClientsTableAddButton />
					</div>
				</div>

				<div className="overflow-hidden rounded-xl border border-border bg-card">
					<SelectClientsTable isPending={isPending} table={table} />
				</div>

				<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<p className="text-muted-foreground text-sm">
						Mostrando {currentPageRowsCount} de {totalClientsCount} clientes
						cadastrados
					</p>

					<div className="flex items-center gap-2 self-end md:self-auto">
						<Button
							disabled={!table.getCanPreviousPage()}
							onClick={() => table.previousPage()}
							size="sm"
							type="button"
							variant="secondary"
						>
							Anterior
						</Button>

						{paginationItems.map((item) => {
							if (typeof item === "string") {
								return (
									<span
										className="px-1 text-muted-foreground/80 text-sm"
										key={item}
									>
										...
									</span>
								);
							}

							const isActivePage =
								item === table.getState().pagination.pageIndex + 1;

							return (
								<Button
									className="h-8 min-w-8 px-2"
									key={item}
									onClick={() => table.setPageIndex(item - 1)}
									size="sm"
									type="button"
									variant={isActivePage ? "default" : "ghost"}
								>
									{item}
								</Button>
							);
						})}

						<Button
							disabled={!table.getCanNextPage()}
							onClick={() => table.nextPage()}
							size="sm"
							type="button"
							variant="secondary"
						>
							Proximo
						</Button>
					</div>
				</div>
			</section>

			<div className="flex w-full flex-col gap-3 place-self-end md:flex-row lg:w-fit lg:ml-auto">
				<Button
					className="w-full lg:w-fit"
					onClick={handleGoBack}
					type="button"
					variant="secondary"
				>
					<ArrowLeftIcon aria-hidden="true" className="opacity-80" size={16} />
					Voltar
				</Button>
				<Button
					className="group w-full lg:w-fit"
					disabled={!hasSelectedClient}
					onClick={handleNextStep}
					type="button"
				>
					Continuar
					<ArrowRightIcon
						aria-hidden="true"
						className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
						size={16}
					/>
				</Button>
			</div>
		</div>
	);
};
