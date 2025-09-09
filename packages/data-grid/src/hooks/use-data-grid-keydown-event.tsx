import { useCallback } from "react";
import { DataGridCoordinatesType } from "../components/types";
import { DataGridMaxtrix } from "../models/data-grid-matrix";

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const VERTICAL_KEYS = ["ArrowUp", "ArrowDown"];
type UseDataGridKeydownEventOptions<TData, TValue> = {
  matrix: DataGridMaxtrix<TData>;
  anchor: DataGridCoordinatesType | null;
  setSingleRange: (coords: DataGridCoordinatesType | null) => void;
  setRangeEnd: (coords: DataGridCoordinatesType | null) => void;
};

export const useDataGridKeydownEvent = <TData, TValue>({
  matrix,
  anchor,
  setSingleRange,
}: UseDataGridKeydownEventOptions<TData, TValue>) => {
  const handleKeyboardNavigation = useCallback(
    (e: KeyboardEvent) => {
      const direction = VERTICAL_KEYS.includes(e.key)
        ? "vertical"
        : "horizontal";

      const updater = setSingleRange;

      const basis = anchor;
      console.log({ anchor });
      if (!basis) {
        return;
      }

      const { row, col } = basis;
      const handleNavigation = (coords: DataGridCoordinatesType) => {
        e.preventDefault();
        e.stopPropagation();

        updater(coords);
      };

      const next = matrix.getValidMovement(row, col, e.key);
      console.log({ next, row, col });
      handleNavigation(next);
    },
    [matrix, anchor, setSingleRange]
  );

  const handleKeyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      if (ARROW_KEYS.includes(e.key)) {
        handleKeyboardNavigation(e);
        return;
      }
    },
    [anchor, matrix, setSingleRange]
  );

  return {
    handleKeyDownEvent,
  };
};
