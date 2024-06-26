"use client"

import * as React from "react"
import {
    Cell,
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import formatCell from "@/app/utils/dashboard/FormatCell"

function createColumns(headers: any[] | undefined): ColumnDef<any>[] {
    const columns: ColumnDef<any>[] = [];
    if (headers) {
        for (let i = 0; i < headers.length; i++) {
            if (headers[i]) {
                columns.push({
                    accessorKey: formattedHeaderToKey(headers[i].toString()),
                    header: headers[i],
                    cell: ({ row }) => { return <div className="lowercase">{row.getValue(formattedHeaderToKey(headers[i].toString()))}</div> },
                })
            }
        }
    }
    return columns;
}

function formattedHeaderToKey(header: string): string {
    return header.substring(0, 1).toLowerCase() + header.substring(1).replace(/ /g, "");
}

interface PageProps {
    headers: any[],
    cells: any[]
}

export default function DashboardInfoTable({ headers, cells }: PageProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [showTable, setShowTable] = React.useState<boolean>(false);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({});

    const [data, setData] = React.useState<any>([]);
    const [columns, setColumns] = React.useState<any>([]);

    React.useEffect(() => {
        if (headers) {
            const newData: any = cells.map((row) => {
                const newRows: any = {};
                for (let i = 0; i < headers.length; i++) {
                    const key = formattedHeaderToKey(headers[i].toString());
                    newRows[key] = row[i];
                }
                return newRows;
            });
            setData(newData);
            setColumns(createColumns(headers));
        }
    }, [headers, cells]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Button onClick={() => setShowTable(!showTable)} variant="outline" className="ml-auto">
                    Mostrar tabela <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
            {
                showTable && (
                    <>
                        <div className="rounded-md border max-w-full">
                            <ScrollArea>
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {formatCell(cell)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                                {table.getFilteredRowModel().rows.length} row(s) selected.
                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>

                )
            }
        </div>
    )
}