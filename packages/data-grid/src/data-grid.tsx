import React from 'react'
import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";

export type DataGridProps = React.ComponentPropsWithoutRef<"div"> & {
    children?: React.ReactNode;
};

const DataGrid: React.FC<DataGridProps> = ({...props}) => {
    const grid = useReactTable({
        data: Array.from({length: 20}),
        columns: [
            {
                id: "first",
                accessorKey: "first"
            },
            {
                id: "second",
                accessorKey: "Second"
            },
            {
                id: "third",
                accessorKey: "third"
            }
        ],
        defaultColumn: {
            size: 200,
            maxSize: 400
        },
        getCoreRowModel: getCoreRowModel()
    })

    const {flatRows} = grid.getRowModel();
    const visibleRows = flatRows
    console.log({flatRows, visibleRows})

    return <div  {...props}>
        <div className="bg-gray-200 flex flex-col size-full">
            {/*    DataGridHeader */}
            {/*    DataGridBody */}
            <div className="size-full overflow-hidden">
                <div data-slot="data-grid-container" className="relative h-full overflow-auto outline-none">
                    <div role={"grid"} className="grid">
                        <div role="rowgroup" className="grid">
                            {grid.getHeaderGroups().map((headerGroup, i) => {
                                return <div role={"row"} className={"flex h-10 w-full"} key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {

                                        console.log({headerGroup, header})
                                        return (
                                            <div role="columnheader" key={header.id}
                                                 className="flex items-center px-4 py-2.5 bg-gray-50 border-b border-r border-gray-100"
                                                 style={{
                                                     width: header.getSize(),

                                                 }}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </div>
                                        )
                                    })}
                                </div>
                            })}
                        </div>
                        <div role="rowgroup" className="relative grid">
                            {
                                visibleRows.map((row, i) => {
                                    return <div role={"row"} aria-rowindex={row.index}
                                                className="flex h-10 w-full">{row.id}</div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

DataGrid.displayName = "DataGrid"

export {
    DataGrid
}
