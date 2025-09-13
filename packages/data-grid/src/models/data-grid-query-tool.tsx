import { DataGridCoordinatesType } from "../components/types";
import { generateCellId } from "../lib/utils";

export class DataGridQueryTool {
  private container: HTMLElement | null;

  constructor(container: HTMLElement | null) {
    this.container = container;
  }

  getInput(cell: DataGridCoordinatesType) {
    const id = this._getCellId(cell);
    const input = this.container?.querySelector(`[data-cell-id="${id}"]`);

    if (!input) {
      return null;
    }

    return input as HTMLInputElement;
  }

  private _getCellId(cell: DataGridCoordinatesType): string {
    return generateCellId(cell);
  }
}
