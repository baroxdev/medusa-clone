import { LegacyRef, useEffect, useState } from "react";
import { useDataGridCell } from "../hooks/use-data-grid-cell";
import { DataGridCellContainer } from "./data-grid-cell-container";
import { DataGridCellProps, InputProps } from "./types";
import { useCombinedRefs } from "../hooks/use-combined-refs";

export const DataGridTextCell = <TData, TValue = any>({
  context,
}: DataGridCellProps<TData, TValue>) => {
  const { renderProps } = useDataGridCell({
    context,
  });

  const { container, input } = renderProps;
  return (
    <DataGridCellContainer {...container}>
      <Inner inputProps={input} />
    </DataGridCellContainer>
  );
};

const Inner = ({ inputProps }: { inputProps: InputProps }) => {
  const {
    ref: inputRef,
    value,
    onBlur,
    onFocus,
    onChange,
    ...input
  } = inputProps;
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const combinedRef = useCombinedRefs(inputRef);
  return (
    <input
      ref={combinedRef}
      className={
        "cursor-pointer flex items-center justify-center bg-transparent size-full focus:cursor-text"
      }
      value={localValue}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={(e) => {
        setLocalValue(e.target.value);
      }}
      {...input}
    />
  );
};
