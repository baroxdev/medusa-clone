import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CellContext,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataGridTextCell } from "./components/data-grid-text-cell";
import { DataGridContext } from "./context/data-grid-context";
import { DataGridCoordinatesType } from "./components/types";
import { useDataGridKeydownEvent } from "./hooks/use-data-grid-keydown-event";

export type DataGridRootProps = React.ComponentPropsWithoutRef<"div"> & {
  children?: React.ReactNode;
};

const COLUMNS = [
  {
    id: "id",
    accessorKey: "id",
    cell: (context) => <DataGridTextCell context={context} />,
  },
  {
    id: "first",
    accessorKey: "first",
    cell: (context) => <DataGridTextCell context={context} />,
  },
  {
    id: "second",
    accessorKey: "second",
    cell: (context) => <DataGridTextCell context={context} />,
  },
  {
    id: "third",
    accessorKey: "third",
    cell: (context) => <DataGridTextCell context={context} />,
  },
];

const EXAMPLE_DATA = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  first: `first ${i}`,
  second: `second ${i}`,
  third: `third ${i}`,
}));

const DataGridRoot: React.FC<DataGridRootProps> = ({ ...props }) => {
  const [anchor, setAnchor] = useState<DataGridCoordinatesType | null>(null);
  const [rangeEnd, setRangeEnd] = useState<DataGridCoordinatesType | null>(
    null
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const grid = useReactTable({
    data: EXAMPLE_DATA,
    columns: COLUMNS,
    defaultColumn: {
      size: 200,
      maxSize: 400,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const { flatRows } = grid.getRowModel();
  const visibleRows = flatRows;
  const flatColumns = grid.getAllFlatColumns();

  const onEditingChangeHandler = useCallback(
    (value: boolean) => {
      setIsEditing(value);
    },
    [anchor]
  );

  const setSingleRange = useCallback(
    (coords: DataGridCoordinatesType | null) => {
      setAnchor(coords);
      setRangeEnd(coords);
    },
    []
  );

  const getWrapperFocusHandler = useCallback(
    (coords: DataGridCoordinatesType) => {
      return (_e: React.FocusEvent<HTMLElement>) => {
        setSingleRange(coords);
      };
    },
    [setSingleRange]
  );

  const { handleKeyDownEvent } = useDataGridKeydownEvent();

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDownEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [handleKeyDownEvent]);

  const values = useMemo(
    () => ({
      anchor,
      setIsEditing: onEditingChangeHandler,
      setIsSelecting,
      setSingleRange,
      getWrapperFocusHandler,
    }),
    [
      anchor,
      onEditingChangeHandler,
      setIsSelecting,
      setSingleRange,
      getWrapperFocusHandler,
    ]
  );

  return (
    <DataGridContext.Provider value={values}>
      <div {...props}>
        <div className="bg-gray-200 flex flex-col size-full">
          {/*    DataGridHeader */}
          {/*    DataGridBody */}
          <div className="size-full overflow-hidden">
            <div
              data-slot="data-grid-container"
              className="relative h-full overflow-auto outline-none"
            >
              <div role={"grid"} className="grid">
                <div role="rowgroup" className="grid">
                  {grid.getHeaderGroups().map((headerGroup, i) => {
                    return (
                      <div
                        role={"row"}
                        className={"flex h-10 w-full"}
                        key={headerGroup.id}
                      >
                        {headerGroup.headers.map((header) => {
                          return (
                            <div
                              role="columnheader"
                              key={header.id}
                              className="flex items-center px-4 py-2.5 bg-gray-50 border-b border-r "
                              style={{
                                width: header.getSize(),
                              }}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <div role="rowgroup" className="relative grid">
                  {visibleRows.map((row, i) => {
                    const rowIndex = row.index;
                    const visibleCells = row.getVisibleCells();

                    return (
                      <div
                        key={row.id}
                        role="row"
                        aria-rowindex={rowIndex}
                        className="flex h-10 w-full"
                      >
                        {visibleCells.map((cell) => {
                          const column = cell.column;
                          const columnIndex = flatColumns.findIndex(
                            (c) => c.id === column.id
                          );
                          return (
                            <div
                              key={cell.id}
                              role="gridcell"
                              aria-rowindex={rowIndex}
                              aria-colindex={columnIndex}
                              data-row-index={rowIndex}
                              data-column-index={columnIndex}
                              style={{
                                width: cell.column.getSize(),
                              }}
                              className="flex items-center border-b border-r p-0 outline-none"
                              // Note: Don't know why need this
                              // NOTE UPDATED: maybe to prevent the incorrect navgate when tab
                              tabIndex={-1}
                            >
                              <div className="relative w-full h-full">
                                {flexRender(cell.column.columnDef.cell, {
                                  ...cell.getContext(),
                                  rowIndex,
                                  columnIndex,
                                } as CellContext<any, any>)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataGridContext.Provider>
  );
};

DataGridRoot.displayName = "DataGrid";

const _DataGrid = ({ ...props }: DataGridRootProps) => {
  return <DataGridRoot {...props} />;
};

export const DataGrid = Object.assign(_DataGrid, {
  TextCell: DataGridTextCell,
});
