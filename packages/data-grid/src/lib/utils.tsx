import { DataGridCoordinatesType } from "../components/types";

export function generateCellId(coords: DataGridCoordinatesType) {
  return `${coords.row}:${coords.col}`;
}

/**
 *
 */
export function isCellMatch(
  cell: DataGridCoordinatesType,
  coords: DataGridCoordinatesType | null
) {
  if (!coords) return false;

  return cell.col === coords.col && cell.row === coords.row;
}
