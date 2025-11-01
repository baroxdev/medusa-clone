import { useCallback } from "react";
import { DataGridUpdateCommand } from "../models/data-grid-update-command";
import { DataGridMaxtrix } from "../models/data-grid-matrix";
import { FieldValues } from "react-hook-form";
import { DataGridCoordinatesType } from "../components/types";

type UseDataGridCellHandlersOptions<TData, TFieldValues extends FieldValues> = {
  setValue: any;
  matrix: DataGridMaxtrix<TData, TFieldValues>;
  anchor: DataGridCoordinatesType | null;
  rangeEnd: DataGridCoordinatesType | null;
  setRangeEnd: (value: DataGridCoordinatesType | null) => void;
  multiColumnSelection: boolean;
  isEditing: boolean;
  isSelecting: boolean;
  setIsSelecting: (value: boolean) => void;
};

export const useDataGridCellHandlers = <
  TData,
  TFieldValues extends FieldValues,
>({
  setValue,
  matrix,
  anchor,
  rangeEnd,
  setRangeEnd,
  multiColumnSelection,
  isEditing,
  isSelecting,
  setIsSelecting,
}: UseDataGridCellHandlersOptions<TData, TFieldValues>) => {
  // Simple version as I usually do
  //   const getInputChangeHandler = useCallback((field: any) => {
  //     return (next: any, prev: any) => {
  //       console.log({ field, next, prev });
  //       setValue(field, next);
  //     };
  //   }, []);

  // Medusa's version
  const getInputChangeHandler = useCallback((field: any) => {
    return (next: any, prev: any) => {
      const command = new DataGridUpdateCommand({
        prev,
        next,
        setter: (value) => {
          setValue(field, value);
        },
      });

      // FIXME: Implement with command history later
      command.execute();
    };
  }, []);

  const getIsCellSelected = useCallback(
    (cell: DataGridCoordinatesType | null) => {
      // #WHY no need to check, because matrix.getIsCellSelected already checks
      // if (!cell || !anchor || !rangeEnd) {
      //   return false;
      // }
      return matrix.getIsCellSelected(cell, anchor, rangeEnd);
    },
    [matrix, anchor, rangeEnd]
  );

  const getWrapperMouseOverHandler = useCallback(
    (coords: DataGridCoordinatesType | null) => {
      if (!isSelecting) {
        return;
      }
      return (_e: React.MouseEvent<HTMLElement>) => {
        if (isSelecting) {
          setRangeEnd(coords);
        }
      };
    },
    [isSelecting, setRangeEnd]
  );

  const getWrapperMouseDownHandler = useCallback(() => {
    return (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };
  }, []);

  return {
    getInputChangeHandler,
    getIsCellSelected,
    getWrapperMouseOverHandler,
    getWrapperMouseDownHandler,
  };
};
