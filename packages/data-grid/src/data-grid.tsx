import {
  CellContext,
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DataGridTextCell } from "./components/data-grid-text-cell";
import { DataGridCoordinatesType } from "./components/types";
import { DataGridContext } from "./context/data-grid-context";
import { useDataGridKeydownEvent } from "./hooks/use-data-grid-keydown-event";
import { useDataGridQueryTool } from "./hooks/use-data-grid-query-tool";
import { DataGridMaxtrix } from "./models/data-grid-matrix";
import { DataGridBooleanCell } from "./components/data-grid-boolean-cell";
import { DataGridCurrencyCell } from "./components/data-grid-currency-cell";
import { useVirtualizer } from "@tanstack/react-virtual";

const ROW_HEIGHT = 40;
export type DataGridRootProps = React.ComponentPropsWithoutRef<"div"> & {
  children?: React.ReactNode;
};

const getCommonPinningStyles = <TDataValue,>(
  column: Column<TDataValue>
): CSSProperties => {
  const isPinned = column.getIsPinned();
  return {
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
  };
};

const EXAMPLE_DATA = Array.from({ length: 20000 }).map((_, i) => ({
  id: i,
  first: `first ${i}`,
  second: `second ${i}`,
  second_2: ``,
  third: `third ${i}`,
}));

const columns: ColumnDef<(typeof EXAMPLE_DATA)[number]>[] = [
  {
    id: "id",
    accessorKey: "id",
    cell: (context: CellContext<any, any>) => (
      <DataGrid.TextCell context={context} />
    ),
    meta: {
      type: "text",
    },
  },
  {
    id: "first",
    accessorKey: "first",
    cell: (context: CellContext<any, any>) => (
      <DataGrid.TextCell context={context} />
    ),
    meta: {
      type: "text",
    },
  },
  {
    id: "second",
    accessorKey: "second",
    cell: (context: CellContext<any, any>) => (
      <DataGrid.BooleanCell context={context} />
    ),
    meta: {
      type: "boolean",
    },
  },
  {
    id: "second_2",
    accessorKey: "second_2",
    cell: (context: CellContext<any, any>) => (
      <DataGrid.CurrencyCell context={context} />
    ),
    meta: {
      type: "number",
    },
  },
  {
    id: "third",
    accessorKey: "third",
    cell: (context: CellContext<any, any>) => (
      <DataGrid.TextCell context={context} />
    ),
    meta: {
      type: "text",
    },
  },
];

const DataGridRoot: React.FC<DataGridRootProps> = ({ ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<DataGridCoordinatesType | null>(null);
  const [_rangeEnd, setRangeEnd] = useState<DataGridCoordinatesType | null>(
    null
  );

  const [isEditing, setIsEditing] = useState(false);
  const [_isSelecting, setIsSelecting] = useState(false);

  const grid = useReactTable({
    data: EXAMPLE_DATA,
    columns: columns,
    defaultColumn: {
      size: 200,
      maxSize: 400,
    },
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnPinning: {
        left: [columns[0].id!],
      },
    },
  });

  const { flatRows } = grid.getRowModel();
  const visibleRows = flatRows;
  const visibleColumns = grid.getVisibleLeafColumns();
  const flatColumns = grid.getAllFlatColumns();

  const rowVirtualizer = useVirtualizer({
    count: visibleRows.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => containerRef.current,
    overscan: 5,
    rangeExtractor: (range) => {
      const toRender = new Set(
        Array.from(
          { length: range.endIndex - range.startIndex + 1 },
          (_, i) => range.startIndex + i
        )
      );

      // NOTE: comment because don't understand why need these line
      // if (anchor && visibleRows[anchor.row]) {
      //   toRender.add(anchor.row);
      // }

      // if (_rangeEnd && visibleRows[_rangeEnd.row]) {
      //   toRender.add(_rangeEnd.row)
      // }

      return Array.from(toRender).sort((a, b) => a - b); // current sort direction is ascending
    },
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(),
    getScrollElement: () => containerRef.current,
    horizontal: true,

    // What?
    overscan: 3,

    rangeExtractor: (range) => {
      const startIndex = range.startIndex;
      const endIndex = range.endIndex;

      const toRender = new Set(
        Array.from(
          {
            length: endIndex - startIndex + 1,
          },
          (_, i) => startIndex + i
        )
      );

      // NOTE: comment because don't understand why need these line
      // if (anchor && visibleColumns[anchor.col]) {
      //   toRender.add(anchor.col);
      // }

      // if (_rangeEnd && visibleColumns[_rangeEnd.col]) {
      //   toRender.add(_rangeEnd.col)
      // }

      // The first column is pinned, so we always render it
      // QUESTION: What happen if we not pin the first one? Does this line not dynamic enough?
      toRender.add(0);

      return Array.from(toRender).sort((a, b) => a - b);
    },
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();

  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  const matrix = useMemo(
    () => new DataGridMaxtrix(flatRows, columns),
    [flatRows, columns]
  );

  const queryTool = useDataGridQueryTool(containerRef);

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
  const { handleKeyDownEvent } = useDataGridKeydownEvent({
    matrix,
    anchor,
    queryTool,
    isEditing,
    setRangeEnd,
    setSingleRange,
    onEditingChangeHandler,
  });

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
      <div className="bg-[#fafafa] flex flex-col size-full">
        {/*    DataGridHeader */}
        {/*    DataGridBody */}
        <div className="size-full overflow-hidden">
          <div
            data-slot="data-grid-container"
            ref={containerRef}
            className="relative h-full select-none overflow-auto outline-none"
          >
            <div role="grid" className="grid">
              <div role="rowgroup" className="grid sticky top-0 z-[1]">
                {grid.getHeaderGroups().map((headerGroup) => {
                  return (
                    <div
                      role={"row"}
                      className={"flex h-10 w-full"}
                      key={headerGroup.id}
                    >
                      {virtualPaddingLeft ? (
                        <div
                          role="presentation"
                          style={{
                            display: "flex",
                            width: virtualPaddingLeft,
                          }}
                        />
                      ) : null}
                      {virtualColumns.reduce((acc, vc, index, array) => {
                        const header = headerGroup.headers[vc.index];
                        const previousVC = array[index - 1];

                        if (previousVC && vc.index !== previousVC.index + 1) {
                          acc.push(
                            <div
                              key={`padding-${previousVC.index}-${vc.index}`}
                              role="presentation"
                              style={{
                                display: "flex",
                                width: `${vc.start - previousVC.end}px`,
                              }}
                            />
                          );
                        }

                        acc.push(
                          <div
                            key={header.id}
                            role="columnheader"
                            data-column-index={vc.index}
                            className="flex items-center font-medium px-4 py-2.5 bg-white border-b border-t text-[#52525B] text-sm border-r border-[#e4e4e7]"
                            style={{
                              width: header.getSize(),
                              ...getCommonPinningStyles(header.column),
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

                        return acc;
                      }, [] as React.ReactNode[])}
                      {virtualPaddingRight ? (
                        <div
                          role="presentation"
                          style={{
                            display: "flex",
                            width: virtualPaddingRight,
                          }}
                        />
                      ) : null}
                      {/* {headerGroup.headers.map((header) => {
                        return (
                          <div
                            role="columnheader"
                            key={header.id}
                            className="flex items-center font-medium px-4 py-2.5 bg-white border-b border-t text-[#52525B] text-sm border-r border-[#e4e4e7]"
                            style={{
                              width: header.getSize(),
                              ...getCommonPinningStyles(header.column),
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
                      })} */}
                    </div>
                  );
                })}
              </div>
              <div
                role="rowgroup"
                className="relative grid"
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                }}
              >
                {virtualRows.map((virtualRow) => {
                  const row = visibleRows[virtualRow.index];
                  const rowIndex = flatRows.findIndex((r) => r.id === row.id);
                  const visibleCells = row.getVisibleCells();

                  return (
                    <div
                      key={row.id}
                      role="row"
                      aria-rowindex={virtualRow.index}
                      style={{
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className="flex h-10 flex w-full absolute"
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
                              ...getCommonPinningStyles(cell.column),
                            }}
                            className="flex items-center border-b border-r border-[#e4e4e7] p-0 outline-none"
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
    </DataGridContext.Provider>
  );
};

DataGridRoot.displayName = "DataGrid";

const _DataGrid = ({ ...props }: DataGridRootProps) => {
  return <DataGridRoot {...props} />;
};

export const DataGrid = Object.assign(_DataGrid, {
  TextCell: DataGridTextCell,
  BooleanCell: DataGridBooleanCell,
  CurrencyCell: DataGridCurrencyCell,
});
