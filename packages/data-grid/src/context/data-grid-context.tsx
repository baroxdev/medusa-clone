import { createContext } from "react";
import { DataGridCoordinatesType } from "../components/types";
import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";

type DataGridContextType<TFieldValues extends FieldValues> = {
  // Grid states
  anchor: DataGridCoordinatesType | null;
  errors: FieldErrors<TFieldValues>;

  // Grid handlers
  setIsEditing: (value: boolean) => void;
  setIsSelecting: (value: boolean) => void;
  setSingleRange: (coords: DataGridCoordinatesType) => void;

  // Form state and handlers
  register: UseFormRegister<TFieldValues>;
  control: Control<TFieldValues>;

  // Wrapper handlers
  getWrapperFocusHandler: (
    coordinates: DataGridCoordinatesType
  ) => (e: React.FocusEvent<HTMLElement>) => void;
};

export const DataGridContext = createContext<DataGridContextType<any> | null>(
  null
);
