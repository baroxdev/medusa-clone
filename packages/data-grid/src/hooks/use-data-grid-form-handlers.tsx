import { useCallback } from "react";
import set from "lodash/set";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { DataGridMaxtrix } from "../models/data-grid-matrix";
import {
  DataGridColumnType,
  DataGridCoordinatesType,
} from "../components/types";

type UseDataGridFormHandlersOptions<TData, TFieldValues extends FieldValues> = {
  matrix: DataGridMaxtrix<TData, TFieldValues>;
  form: UseFormReturn<TFieldValues>;
  anchor: DataGridCoordinatesType | null;
};

export const useDataGridFormHandlers = <
  TData,
  TFieldValues extends FieldValues,
>({
  matrix,
  form,
  anchor,
}: UseDataGridFormHandlersOptions<TData, TFieldValues>) => {
  const { getValues, reset } = form;

  const getSelectionValues = useCallback(
    (fields: string[]): PathValue<TFieldValues, Path<TFieldValues>>[] => {
      if (!fields.length) {
        return [];
      }

      const allValues = getValues();

      return fields.map((field) => {
        // BEST PRACTICE
        return field.split(".").reduce((obj, key) => obj?.[key], allValues);
      }) as PathValue<TFieldValues, Path<TFieldValues>>[];
    },
    []
  );

  const setSelectionValues = useCallback(
    (fields: string[], values: string[], isHistory?: boolean) => {
      if (!fields.length || !anchor) {
        return;
      }

      const type = matrix.getCellType(anchor);

      if (!type) {
        return;
      }

      // FIXME: Let see why do we need to convert values here
      // const convertedValues = convertArrayToPrimitive(values, type)
      const rawValues = values;
      const currentValues = getValues();

      fields.forEach((field, index) => {
        if (!field) {
          return;
        }

        // Keep the index within bounds of rawValues
        const valueIndex = index % rawValues.length;
        const newValue = rawValues[valueIndex];
        setValue(currentValues, field, newValue, type, isHistory);
      });

      reset(currentValues, {
        keepDirty: true,
        keepTouched: true,
        keepDefaultValues: true,
      });
    },
    [matrix, anchor, getValues, reset]
  );

  return {
    getSelectionValues,
    setSelectionValues,
  };
};

function setValue<T>(
  currentValues: any,
  field: string,
  newValue: T,
  _type: string,
  _isHistory?: boolean
) {
  set(currentValues, field, newValue);
}

export function convertArrayToPrimitive(
  _values: any[],
  _type: DataGridColumnType
): any[] {
  return [];
}
