import { CellContext, ColumnDef, ColumnMeta, Row } from "@tanstack/react-table";
import React, { PropsWithChildren, ReactNode, RefObject } from "react";
import { FieldPath, FieldValues } from "react-hook-form";

export type DataGridDirection = string;

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

export type GridCell<TFieldValues extends FieldValues> = {
  field: FieldPath<TFieldValues>;
  type: DataGridColumnType;
  enabled: boolean;
};

export type Grid<TFieldValues extends FieldValues> =
  (GridCell<TFieldValues> | null)[][];
export type DataGridColumnType = "text" | "boolean" | "number";

export type FieldContext<TData> = {
  row: Row<TData>;
  column: ColumnDef<TData>;
};
export type FieldFunction<TData, TFieldValues extends FieldValues> = (
  context: FieldContext<TData>
) => FieldPath<TFieldValues> | null;

export type InternalColumnMeta<TData, TFieldValues extends FieldValues> = {
  name: string;
  field?: FieldFunction<TData, TFieldValues>;
} & (
  | {
      field: string;
      type: DataGridColumnType;
    }
  | {
      field?: null | undefined;
      type?: never;
    }
) &
  ColumnMeta<TData, any>;

export type InputAttributes = {
  "data-row": number;
  "data-col": number;
  "data-cell-id": string;
  "data-field": string;
};

export type InnerAttributes = {
  "data-container-id": string;
};

export type CellMetadata = {
  id: string;
  field: string;
  type: DataGridColumnType;
  inputAttributes: InputAttributes;
  innerAttributes: InnerAttributes;
};
