import { useCallback } from "react";
import { DataGridCoordinatesType } from "../components/types";
import { DataGridMaxtrix } from "../models/data-grid-matrix";
import { DataGridQueryTool } from "../models/data-grid-query-tool";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import { DataGridUpdateCommand } from "../models/data-grid-update-command";
import { DataGridBulkUpdateCommand } from "../lib/data-grid-bulk-update-command";

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const VERTICAL_KEYS = ["ArrowUp", "ArrowDown"];
type UseDataGridKeydownEventOptions<TData, TFieldValues extends FieldValues> = {
  matrix: DataGridMaxtrix<TData, TFieldValues>;
  anchor: DataGridCoordinatesType | null;
  queryTool: DataGridQueryTool | null;
  isEditing: boolean;
  getValues: UseFormGetValues<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  setSingleRange: (coords: DataGridCoordinatesType | null) => void;
  setRangeEnd: (coords: DataGridCoordinatesType | null) => void;
  onEditingChangeHandler: (value: boolean) => void;
  getSelectionValues: (
    fields: string[]
  ) => PathValue<TFieldValues, Path<TFieldValues>>[];
  setSelectionValues: (fields: string[], values: string[]) => void;
  execute: (command: DataGridUpdateCommand | DataGridBulkUpdateCommand) => void;
};

export const useDataGridKeydownEvent = <
  TData,
  TFieldValues extends FieldValues,
>({
  isEditing,
  matrix,
  anchor,
  queryTool,
  setSingleRange,
  onEditingChangeHandler,
  getSelectionValues,
  setSelectionValues,
  getValues,
  setValue,
  execute,
}: UseDataGridKeydownEventOptions<TData, TFieldValues>) => {
  const handleKeyboardNavigation = useCallback(
    (e: KeyboardEvent) => {
      if (!anchor) {
        return;
      }
      const type = matrix.getCellField(anchor);

      if (isEditing || type == "boolean") {
        return;
      }

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
    [matrix, anchor, setSingleRange, isEditing]
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
    (_e: KeyboardEvent, anchor: DataGridCoordinatesType) => {
      console.warn("DO NOTHING WITH ENTER AT BOOLEAN CELL");
      const field = matrix.getCellField(anchor);

      if (!field) {
        return;
      }

      // const current = getValues()
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
        case "number":
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

  const handleSpaceKeyBoolean = useCallback(
    (anchor: DataGridCoordinatesType) => {
      const end = anchor;

      const fields = matrix.getFieldsInSelection(anchor, end);

      const prev = getSelectionValues(fields) as boolean[];

      const allChecked = prev.every((value) => value === true);
      const next = Array.from({ length: prev.length }, () => !allChecked);
      const command = new DataGridBulkUpdateCommand({
        fields,
        next,
        prev,
        setter: setSelectionValues,
      });
      execute(command);
    },
    [anchor, getSelectionValues, setSelectionValues]
  );

  /**
   * You might wonder why we handle reset input by space key here,
   * while we've handled it in src/hooks/use-data-grid-cell.tsx (line 121).
   * The reason is that, in that place, we only handle the case
   * resetting input on the ui only, but we do not update the form value.
   * So here we handle the form value update when space key is pressed.
   */
  const handleSpaceKeyTextOrNumber = useCallback(
    (anchor: DataGridCoordinatesType) => {
      const field = matrix.getCellField(anchor);
      const input = queryTool?.getInput(anchor);
      if (!field || !input) {
        return;
      }

      const current = getValues(field as Path<TFieldValues>);
      const next = "";

      const command = new DataGridUpdateCommand({
        next,
        prev: current,
        setter: (value) => {
          setValue(field as Path<TFieldValues>, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
        },
      });

      command.execute();

      input.focus();
    },
    [matrix]
  );

  const handleSpaceKey = useCallback(
    (e: KeyboardEvent) => {
      console.log("HANDLE SPACE KEY at KEYDOWN EVENT");
      if (!anchor || isEditing) {
        return;
      }

      e.preventDefault();

      const type = matrix.getCellType(anchor);

      if (!type) {
        return;
      }

      switch (type) {
        case "boolean":
          handleSpaceKeyBoolean(anchor);
          break;
        case "number":
        case "text":
          handleSpaceKeyTextOrNumber(anchor);
          break;
      }
    },
    [anchor, matrix, isEditing]
  );

  const handleKeyDownEvent = useCallback(
    (e: KeyboardEvent) => {
      // FIXME: Cannot Shift + Select at the boolean cells.
      switch (true) {
        case ARROW_KEYS.includes(e.key):
          handleKeyboardNavigation(e);
          return;
        case e.key === " ": {
          handleSpaceKey(e);
          return;
        }
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
