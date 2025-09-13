import { ColumnDef, Row } from "@tanstack/react-table";
import {
  DataGridCoordinatesType,
  DataGridDirection,
  Grid,
} from "../components/types";

export class DataGridMaxtrix<TData> {
  private cells: Grid;

  constructor(data: Row<TData>[], columns: ColumnDef<TData>[]) {
    this.cells = this._populateCells(data, columns);
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

  private _isValidPosition(row: number, col: number, cells?: Grid): boolean {
    if (!cells) {
      cells = this.cells;
    }

    return row >= 0 && row < cells.length && col >= 0 && col < cells[0].length;
  }

  private _populateCells(rows: Row<TData>[], columns: ColumnDef<TData>[]) {
    const cells = Array.from({ length: rows.length }, () =>
      Array(columns.length).fill(null)
    ) as Grid;

    rows.forEach((_row, rowIndex) => {
      columns.forEach((_column, colIndex) => {
        if (!this._isValidPosition(rowIndex, colIndex, cells)) {
          return;
        }
        cells[rowIndex][colIndex] = {
          enabled: true,
          type: "text",
          field: `field-${rowIndex}:${colIndex}`,
        };
      });
    });

    return cells;
  }
}
