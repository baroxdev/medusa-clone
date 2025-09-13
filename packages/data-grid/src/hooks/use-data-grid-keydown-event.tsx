import { useCallback } from "react";
import { DataGridCoordinatesType } from "../components/types";
import { DataGridMaxtrix } from "../models/data-grid-matrix";
import { DataGridQueryTool } from "../models/data-grid-query-tool";

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const VERTICAL_KEYS = ["ArrowUp", "ArrowDown"];
type UseDataGridKeydownEventOptions<TData, TValue> = {
  matrix: DataGridMaxtrix<TData>;
  anchor: DataGridCoordinatesType | null;
  queryTool: DataGridQueryTool | null;
  isEditing: boolean;
  setSingleRange: (coords: DataGridCoordinatesType | null) => void;
  setRangeEnd: (coords: DataGridCoordinatesType | null) => void;
  onEditingChangeHandler: (value: boolean) => void;
};

export const useDataGridKeydownEvent = <TData, TValue>({
  isEditing,
  matrix,
  anchor,
  queryTool,
  setSingleRange,
  onEditingChangeHandler,
}: UseDataGridKeydownEventOptions<TData, TValue>) => {
  const handleKeyboardNavigation = useCallback(
    (e: KeyboardEvent) => {
      const direction = VERTICAL_KEYS.includes(e.key)
        ? "vertical"
        : "horizontal";

      const updater = setSingleRange;

      const basis = anchor;

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
      handleNavigation(next);
    },
    [matrix, anchor, setSingleRange]
  );

  const handleMoveOnEnter = useCallback(
    (e: KeyboardEvent, anchor: DataGridCoordinatesType) => {
      const direction = e.shiftKey ? "ArrowUp" : "ArrowDown";
      const pos = matrix.getValidMovement(anchor.row, anchor.col, direction);

      setSingleRange(pos);

      onEditingChangeHandler(false);
    },
    [matrix]
  );

  const handleEditOnrEnter = useCallback(
    (anchor: DataGridCoordinatesType) => {
      const input = queryTool?.getInput(anchor);
      if (!input) {
        return;
      }
      input.focus();
      onEditingChangeHandler(true);
    },
    [queryTool, onEditingChangeHandler]
  );

  const handleEnterKeyTextOrNumber = useCallback(
    (e: KeyboardEvent, anchor: DataGridCoordinatesType) => {
      if (isEditing) {
        handleMoveOnEnter(e, anchor);
      }
      handleEditOnrEnter(anchor);
    },
    [isEditing, handleMoveOnEnter, handleEditOnrEnter]
  );

  const handleEnterKey = useCallback(
    (e: KeyboardEvent) => {
      console.log("[EVENT] Enter key");
      // check if the anchor is editing
      if (!anchor) {
        return;
      }

      e.preventDefault();

      handleEnterKeyTextOrNumber(e, anchor);
    },
    [matrix, anchor, handleEnterKeyTextOrNumber]
  );

  const handleKeyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      switch (true) {
        case ARROW_KEYS.includes(e.key):
          handleKeyboardNavigation(e);
          return;
        case e.key === "Enter":
          handleEnterKey(e);
          return;
      }
    },
    [handleKeyboardNavigation, handleEnterKey]
  );

  return {
    handleKeyDownEvent,
  };
};
