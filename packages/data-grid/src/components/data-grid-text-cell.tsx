import { useEffect, useState } from "react";
import { useCombinedRefs } from "../hooks/use-combined-refs";
import { useDataGridCell } from "../hooks/use-data-grid-cell";
import { DataGridCellContainer } from "./data-grid-cell-container";
import { DataGridCellProps, InputProps } from "./types";
import { cn } from "@medusa-clone/ui";

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
      className={cn(
        "cursor-pointer flex items-center text-sm text-[#52525B] justify-center bg-transparent size-full",
        "focus:cursor-text outline-none"
      )}
      autoComplete="off"
      tabIndex={-1}
      value={localValue}
      onBlur={() => {
        onBlur();
        onChange(localValue, value);
      }}
      onFocus={onFocus}
      onChange={(e) => {
        setLocalValue(e.target.value);
      }}
      {...input}
    />
  );
};
