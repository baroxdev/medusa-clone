import { createContext } from "react";
import { CellMetadata, DataGridCoordinatesType } from "../components/types";
import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  UseFormRegister,
} from "react-hook-form";

type DataGridContextType<TFieldValues extends FieldValues> = {
  // Grid states
  anchor: DataGridCoordinatesType | null;
  errors: FieldErrors<TFieldValues>;
  rangeEnd: DataGridCoordinatesType | null;

  // Grid handlers
  setIsEditing: (value: boolean) => void;
  setIsSelecting: (value: boolean) => void;
  setSingleRange: (coords: DataGridCoordinatesType) => void;
  setRangeEnd: (coords: DataGridCoordinatesType) => void;

  // Form state and handlers
  register: UseFormRegister<TFieldValues>;
  control: Control<TFieldValues>;

  // Wrapper handlers
  getWrapperFocusHandler: (
    coordinates: DataGridCoordinatesType
  ) => (e: React.FocusEvent<HTMLElement>) => void;
  getInputChangeHandler: (
    field: Path<TFieldValues>
  ) => (next: any, prev: any) => void;
  getWrapperMouseOverHandler: (
    coordinates: DataGridCoordinatesType | null
  ) => ((e: React.MouseEvent<HTMLElement>) => void) | undefined;
  getWrapperMouseDownHandler: (
    coordinates: DataGridCoordinatesType | null
  ) => ((e: React.MouseEvent<HTMLElement>) => void) | undefined;
  getIsCellSelected: (cell: DataGridCoordinatesType | null) => boolean;
  getCellMetadata: (coordinates: DataGridCoordinatesType) => CellMetadata;
  getSelectionValues: (
    fields: string[]
  ) => PathValue<TFieldValues, Path<TFieldValues>>[];
};

export const DataGridContext = createContext<DataGridContextType<any> | null>(
  null
);
