import { useEffect, useState } from "react";
import { useCombinedRefs } from "../hooks/use-combined-refs";
import { useDataGridCell } from "../hooks/use-data-grid-cell";
import { DataGridCellContainer } from "./data-grid-cell-container";
import { DataGridCellProps, InputProps } from "./types";
import { cn } from "@medusa-clone/ui";
import { Controller, ControllerRenderProps } from "react-hook-form";

export const DataGridTextCell = <TData, TValue = any>({
  context,
}: DataGridCellProps<TData, TValue>) => {
  const { field, control, renderProps } = useDataGridCell({
    context,
  });

  const { container, input } = renderProps;
  return (
    <Controller
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <DataGridCellContainer {...container}>
            <Inner field={field} inputProps={input} />
          </DataGridCellContainer>
        );
      }}
    />
  );
};

const Inner = ({
  field,
  inputProps,
}: {
  inputProps: InputProps;
  field: ControllerRenderProps<any, string>;
}) => {
  const { onChange: _, onBlur, ref, value, ...rest } = field;
  const {
    ref: inputRef,
    onBlur: onInputBlur,
    onFocus,
    onChange,
    ...input
  } = inputProps;
  const [localValue, setLocalValue] = useState(value);
  console.log({ localValue, value, rest });
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const combinedRef = useCombinedRefs(inputRef, ref);
  return (
    <input
      ref={combinedRef}
      className={cn(
        "cursor-pointer flex items-center text-sm text-[#52525B] justify-center bg-transparent size-full",
        "focus:cursor-text outline-none"
      )}
      autoComplete="off"
      // NOTE: what happen if not set tabIndex?
      tabIndex={-1}
      value={localValue}
      onBlur={() => {
        onBlur();
        onInputBlur();
        onChange(localValue, value);
      }}
      onFocus={onFocus}
      onChange={(e) => {
        setLocalValue(e.target.value);
      }}
      // NOTE: Try placing the spread of rest above the spread of input to understand the reason or randomness.
      {...rest}
      {...input}
    />
  );
};
