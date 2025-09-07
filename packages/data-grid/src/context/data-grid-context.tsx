import { createContext } from "react";
import { DataGridCoordinatesType } from "../components/types";

type DataGridContextType = {
  anchor: DataGridCoordinatesType | null;

  setIsEditing: (value: boolean) => void;
  setIsSelecting: (value: boolean) => void;

  setSingleRange: (coords: DataGridCoordinatesType) => void;
  getWrapperFocusHandler: (
    coordinates: DataGridCoordinatesType
  ) => (e: React.FocusEvent<HTMLElement>) => void;
};

export const DataGridContext = createContext<DataGridContextType | null>(null);
