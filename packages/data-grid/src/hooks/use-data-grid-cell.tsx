import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DataGridCellContext,
  DataGridCellRenderProps,
  DataGridCoordinatesType,
} from "../components/types";
import { useDataGridContext } from "../context/use-data-grid-context";
import { CellContext } from "@tanstack/react-table";
import { generateCellId, isCellMatch } from "../lib/utils";

type UseDataGridCellOptions<TData, TValue> = {
  context: CellContext<TData, TValue>;
};

export const useDataGridCell = <TData, TValue>({
  context,
}: UseDataGridCellOptions<TData, TValue>) => {
  const {
    anchor,
    getWrapperFocusHandler,
    setIsEditing,
    setSingleRange,
    setIsSelecting,
  } = useDataGridContext();

  const [showOverlay, setShowOverlay] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLElement>(null);

  const { columnIndex, rowIndex } = context as DataGridCellContext<
    TData,
    TValue
  >;

  const coords: DataGridCoordinatesType = useMemo(
    () => ({ row: rowIndex, col: columnIndex }),
    [rowIndex, columnIndex]
  );

  const handleOverlayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      console.log({
        inputRef: inputRef.current,
        containerRef: containerRef.current,
      });

      if (e.detail === 2) {
        if (inputRef.current) {
          setShowOverlay(false);
          inputRef.current.focus();

          return;
        }
      }

      if (containerRef.current) {
        setSingleRange(coords);
        setIsSelecting(true);
        containerRef.current.focus();
      }
    },
    [anchor, coords, setSingleRange, setIsSelecting]
  );

  const handleInputBlur = useCallback(() => {
    setIsEditing(false);
    setShowOverlay(true);
  }, [setIsEditing]);

  const handleInputFocus = useCallback(() => {
    setIsEditing(true);
    setShowOverlay(false);
  }, [setIsEditing]);

  const handleContainerKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        // Skip the Enter event handler, let the DataGridRoot handle it.
        return;
      }

      console.log({ showOverlay });

      if (!inputRef.current || !showOverlay) {
        return;
      }
      console.log({
        inputRef: inputRef.current,
        instanceof: inputRef.current instanceof HTMLInputElement,
      });
      inputRef.current?.focus();

      // setShowOverlay(false) // NOTE?: Maybe Redundance setShowOverlay?
      if (inputRef.current instanceof HTMLInputElement) {
        // Clear the current value
        inputRef.current.value = "";

        // WHY use the nativeInputValueSetter and dispatch an event can reload the input?
        // https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-change-or-input-event-in-react-js
        // Simulate typing the new key
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        nativeInputValueSetter?.call(inputRef.current, e.key);

        // Trigger input event to notify react-hook-form
        const event = new Event("input", { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }

      //
      e.stopPropagation();
      e.preventDefault();
    },
    [showOverlay]
  );

  const isAnchor = useMemo(() => {
    return anchor ? isCellMatch(anchor, coords) : false;
  }, [anchor, coords]);

  const id = generateCellId(coords);

  const inputAttributes = {
    "data-row": coords.row,
    "data-col": coords.col,
    "data-cell-id": id,
    "data-field": context.cell.column.id,
    name: id,
  };

  const innerAttributes = {
    "data-container-id": id,
  };

  // NOTE: automatically focus on the container of the cell when moving to another cell.
  useEffect(() => {
    console.log("isAnchor is CHANGED");
    if (isAnchor) {
      containerRef.current?.focus();
    }
  }, [isAnchor]);

  const renderProps: DataGridCellRenderProps = {
    container: {
      field: context.cell.column.id,
      isAnchor: isAnchor,
      isSelected: false,
      isDragSelected: false,
      showOverlay: showOverlay,
      innerProps: {
        ref: containerRef,
        onFocus: getWrapperFocusHandler(coords),
        onMouseOver: () => {},
        onMouseDown: () => {},
        onKeyDown: handleContainerKeyDown,
        ...innerAttributes,
      },
      overlayProps: {
        onMouseDown: handleOverlayMouseDown,
      },
    },
    input: {
      ref: inputRef,
      onBlur: handleInputBlur,
      onFocus: handleInputFocus,
      onChange: () => {},
      value: context.cell.getValue() as string,
      ...inputAttributes,
    },
  };
  return {
    id: generateCellId(coords),
    // field,
    // register,
    // control,
    renderProps,
  };
};
