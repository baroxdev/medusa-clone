import { CellContext } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DataGridCellContext,
  DataGridCellRenderProps,
  DataGridCoordinatesType,
} from "../components/types";
import { useDataGridContext } from "../context/use-data-grid-context";
import { isCellMatch } from "../lib/utils";

type UseDataGridCellOptions<TData, TValue> = {
  context: CellContext<TData, TValue>;
};

const textCharacterRegex = /^.$/u;
const numberCharacterRegex = /^[0-9]$/u;

export const useDataGridCell = <TData, TValue>({
  context,
}: UseDataGridCellOptions<TData, TValue>) => {
  const {
    anchor,
    control,
    errors,
    register,
    getWrapperFocusHandler,
    setIsEditing,
    setSingleRange,
    setIsSelecting,
    getCellMetadata,
    getInputChangeHandler,
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

  const { id, field, type, inputAttributes, innerAttributes } = useMemo(() => {
    return getCellMetadata(coords);
  }, [coords, getCellMetadata]);

  const fieldWithoutOverlay = useMemo(() => {
    return type === "boolean";
  }, [type]);

  const handleOverlayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

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

  const validateKeyStroke = useCallback(
    (key: string) => {
      switch (type) {
        case "number":
          return numberCharacterRegex.test(key);
        case "text":
          return textCharacterRegex.test(key);
        default:
          return false;
      }
    },
    [type]
  );

  const handleContainerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      console.log({ key: e.key });

      // QUESTION: Why do not handle the space here?
      if (!inputRef.current || !validateKeyStroke(e.key) || !showOverlay) {
        return;
      }

      if (e.key === "Enter") {
        // Skip the Enter event handler, let the DataGridRoot handle it.
        return;
      }

      inputRef.current?.focus();

      // setShowOverlay(false) // NOTE?: Maybe Redundance setShowOverlay?
      if (inputRef.current instanceof HTMLInputElement) {
        // Clear the current value
        inputRef.current.value = "";

        // WHY: use the nativeInputValueSetter and dispatch an event can reload the input?
        // ANSWER: https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-change-or-input-event-in-react-js
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
    [showOverlay, validateKeyStroke]
  );

  const isAnchor = useMemo(() => {
    return anchor ? isCellMatch(anchor, coords) : false;
  }, [anchor, coords]);

  // NOTE: automatically focus on the container of the cell when moving to another cell.
  useEffect(() => {
    if (isAnchor) {
      containerRef.current?.focus();
    }
  }, [isAnchor]);

  const renderProps: DataGridCellRenderProps = {
    container: {
      field: field,
      isAnchor: isAnchor,
      isSelected: false,
      isDragSelected: false,
      showOverlay: fieldWithoutOverlay ? false : showOverlay,
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
      onChange: getInputChangeHandler(field),
      ...inputAttributes,
    },
  };
  return {
    id,
    field,
    register,
    control,
    renderProps,
  };
};
