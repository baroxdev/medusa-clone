import { CellContext } from "@tanstack/react-table";
import React, { PropsWithChildren, ReactNode, RefObject } from "react";

export interface DataGridCellProps<TData = unknown, TValue = any> {
  context: CellContext<TData, TValue>;
}

export interface DataGridCellContext<TData, TValue>
  extends CellContext<TData, TValue> {
  columnIndex: number;
  rowIndex: number;
}

interface InnerProps {
  ref: RefObject<HTMLDivElement>;
  onMouseOver: ((e: React.MouseEvent<HTMLElement>) => void) | undefined;
  onMouseDown: ((e: React.MouseEvent<HTMLElement>) => void) | undefined;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLElement>) => void;
  "data-container-id": string;
}

interface OverlayProps {
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface DataGridCellContainerProps extends PropsWithChildren<{}> {
  field: string;
  isAnchor: boolean;
  isSelected: boolean;
  isDragSelected: boolean;
  placeholder?: ReactNode;
  showOverlay: boolean;

  innerProps?: InnerProps;
  overlayProps?: OverlayProps;
  outerComponent?: ReactNode;
}

export interface DataGridCellRenderProps {
  container: DataGridCellContainerProps;
  input: InputProps;
}

export interface InputProps {
  ref: RefObject<HTMLElement>;
  onBlur: () => void;
  onFocus: () => void;
  onChange: (next: any, prev: any) => void;
  "data-row": number;
  "data-col": number;
  "data-cell-id": string;
  "data-field": string;

  // BUG: Temporary
  value?: string;
}

export type DataGridCoordinatesType = {
  row: number;
  col: number;
};

export type GridCell = {
  field: string;
  type: "text";
  enabled: boolean;
};

export type Grid = (GridCell | null)[][];
