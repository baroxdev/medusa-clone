import { ColumnDef, Row } from "@tanstack/react-table";
import {
  DataGridColumnType,
  DataGridCoordinatesType,
  DataGridDirection,
  Grid,
  InternalColumnMeta,
} from "../components/types";
import { FieldValues } from "react-hook-form";

export class DataGridMaxtrix<TData, TFieldValues extends FieldValues> {
  private cells: Grid<TFieldValues>;
  private multiColumnSelection: boolean;

  constructor(
    data: Row<TData>[],
    columns: ColumnDef<TData>[],
    multiColumnSelection: boolean
  ) {
    this.cells = this._populateCells(data, columns);
    this.multiColumnSelection = multiColumnSelection;
  }

  getFieldsInSelection(
    start: DataGridCoordinatesType,
    end: DataGridCoordinatesType
  ): string[] {
    const keys: string[] = [];

    if (!start || !end) {
      return keys;
    }

    const startRow = Math.min(start.row, end.row);
    const endRow = Math.max(start.row, end.row);
    const startCol = start.col;
    const endCol = start.col;

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        if (this._isValidPosition(row, col) && this.cells[row][col] !== null) {
          keys.push(this.cells[row][col]?.field as string);
        }
      }
    }

    return keys;
  }

  getCellField(cell: DataGridCoordinatesType): string | null {
    if (this._isValidPosition(cell.row, cell.col)) {
      return this.cells[cell.row][cell.col]?.field || null;
    }
    return null;
  }

  getCellType(cell: DataGridCoordinatesType): DataGridColumnType | null {
    if (this._isValidPosition(cell.row, cell.col)) {
      return this.cells[cell.row][cell.col]?.type || null;
    }

    return null;
  }

  getValidMovement(
    row: number,
    col: number,
    direction: DataGridDirection
  ): DataGridCoordinatesType {
    const [dRow, dCol] = this._getDirectionDeltas(direction);

    let newRow = row + dRow;
    let newCol = col + dCol;

    // Skip the disabled or invalid cells with while loop
    while (this._isValidPosition(newRow, newCol)) {
      if (
        this.cells[newRow][newCol] !== null &&
        this.cells[newRow][newCol]?.enabled !== false
      ) {
        return {
          row: newRow,
          col: newCol,
        };
      }

      newRow += dRow;
      newCol += dCol;
    }

    return {
      row,
      col,
    };
  }

  getIsCellSelected(
    cell: DataGridCoordinatesType | null,
    start: DataGridCoordinatesType | null,
    end: DataGridCoordinatesType | null
  ): boolean {
    if (!cell || !start || !end) {
      return false;
    }

    if (!this.multiColumnSelection && start.col !== end.col) {
      throw new Error("Multi-column selection is disabled.");
    }

    const startRow = Math.min(start.row, end.row);
    const endRow = Math.max(start.row, end.row);
    const startCol = Math.min(start.col, end.col);
    const endCol = Math.max(start.col, end.col);

    // no suggestion
    return (
      cell.row >= startRow &&
      cell.row <= endRow &&
      cell.col >= startCol &&
      cell.col <= endCol
    );
  }

  private _getDirectionDeltas(direction: DataGridDirection): [number, number] {
    switch (direction) {
      case "ArrowUp":
        return [-1, 0];
      case "ArrowDown":
        return [1, 0];
      case "ArrowLeft":
        return [0, -1];
      case "ArrowRight":
        return [0, 1];
      default:
        return [0, 0];
    }
  }

  private _isValidPosition(
    row: number,
    col: number,
    cells?: Grid<TFieldValues>
  ): boolean {
    if (!cells) {
      cells = this.cells;
    }

    return row >= 0 && row < cells.length && col >= 0 && col < cells[0].length;
  }

  private _populateCells(rows: Row<TData>[], columns: ColumnDef<TData>[]) {
    const cells = Array.from({ length: rows.length }, () =>
      Array(columns.length).fill(null)
    ) as Grid<TFieldValues>;

    rows.forEach((row, rowIndex) => {
      columns.forEach((column, colIndex) => {
        if (!this._isValidPosition(rowIndex, colIndex, cells)) {
          return;
        }

        const { type, field, ...rest } = column.meta as InternalColumnMeta<
          TData,
          TFieldValues
        >;

        const context = {
          row,
          column: {
            ...column,
            meta: rest,
          },
        };

        const fieldValue = field ? field(context) : null;

        if (!fieldValue || !type) {
          return;
        }

        cells[rowIndex][colIndex] = {
          field: fieldValue,
          type,
          enabled: true,
        };
      });
    });

    return cells;
  }
}
