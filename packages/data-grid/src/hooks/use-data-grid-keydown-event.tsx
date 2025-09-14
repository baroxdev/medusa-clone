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

  const handleEnterKeyBoolean = useCallback(
    (e: KeyboardEvent, anchor: DataGridCoordinatesType) => {
      console.warn("DO NOTHING WITH ENTER AT BOOLEAN CELL");
    },
    [anchor]
  );

  const handleEnterKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor) {
        return;
      }

      e.preventDefault();

      const type = matrix.getCellType(anchor);

      switch (type) {
        case "text":
          handleEnterKeyTextOrNumber(e, anchor);
          break;
        case "boolean":
          handleEnterKeyBoolean(e, anchor);
          break;
      }
    },
    [matrix, anchor, handleEnterKeyTextOrNumber, handleEnterKeyBoolean]
  );

  const handleTabKey = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      const direction = e.shiftKey ? "ArrowLeft" : "ArrowRight";
      const pos = matrix.getValidMovement(anchor.row, anchor.col, direction);

      setSingleRange(pos);
    },
    [matrix, anchor, setSingleRange]
  );

  const handleKeyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      console.log({ key: e.key });
      switch (true) {
        case ARROW_KEYS.includes(e.key):
          handleKeyboardNavigation(e);
          return;
        case e.key === "Enter":
          handleEnterKey(e);
          return;
        case e.key === "Tab":
          handleTabKey(e);
          return;
      }
    },
    [handleKeyboardNavigation, handleEnterKey, handleTabKey]
  );

  return {
    handleKeyDownEvent,
  };
};
