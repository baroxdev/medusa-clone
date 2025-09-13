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
        onKeyDown: () => {},
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
