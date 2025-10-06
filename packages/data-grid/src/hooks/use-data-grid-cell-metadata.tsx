import { FieldValues } from "react-hook-form";
import { DataGridMaxtrix } from "../models/data-grid-matrix";
import { useCallback } from "react";
import { generateCellId } from "../lib/utils";
import { DataGridCoordinatesType } from "../components/types";

type UseDataGridCellMetadataOptions<TData, TFieldValues extends FieldValues> = {
  matrix: DataGridMaxtrix<TData, TFieldValues>;
};

export const useDataGridCellMetadata = <
  TData,
  TFieldValues extends FieldValues,
>({
  matrix,
}: UseDataGridCellMetadataOptions<TData, TFieldValues>) => {
  const getCellMetadata = useCallback(
    (coords: DataGridCoordinatesType) => {
      const id = generateCellId(coords);
      const field = matrix.getCellField(coords);
      const type = matrix.getCellType(coords);

      if (!field || !type) {
        throw new Error(`'field' or 'type' is null for cell ${id}`);
      }

      const inputAttributes = {
        "data-row": coords.row,
        "data-col": coords.col,
        "data-cell-id": id,
        "data-field": field,
      };

      const innerAttributes = {
        "data-container-id": id,
      };

      return {
        id,
        field,
        type,
        inputAttributes,
        innerAttributes,
      };
    },
    [matrix]
  );

  return { getCellMetadata };
};
