import {
  CurrencyInput,
  CurrencyInputProps,
  formatValue,
} from "react-currency-input-field";

import { useDataGridCell } from "../hooks/use-data-grid-cell";
import { DataGridCellContainer } from "./data-grid-cell-container";
import { DataGridCellProps, InputProps } from "./types";
import { useCombinedRefs } from "../hooks/use-combined-refs";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@medusa-clone/ui";
import { Controller, ControllerRenderProps } from "react-hook-form";

export const DataGridCurrencyCell = <TData, TValue>({
  context,
}: DataGridCellProps<TData, TValue>) => {
  const { control, field, renderProps } = useDataGridCell({
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
  inputProps,
  field,
}: {
  inputProps: InputProps;
  field: ControllerRenderProps<any, string>;
}) => {
  const { onChange: _, onBlur, ref, value, ...rest } = field;
  const {
    ref: inputRef,
    onFocus,
    onBlur: onInputBlur,
    onChange,
    ...attributes
  } = inputProps;

  const formatter = useCallback((value?: string | number) => {
    const ensuredValue =
      typeof value === "number" ? value.toString() : value || "";
    return formatValue({
      value: ensuredValue,
      decimalScale: 0,
      disableGroupSeparators: true,
      decimalSeparator: ".",
    });
  }, []);
  //   TODO: not init with value yet
  const [localValue, setLocalValue] = useState<string | number>("");

  const handleValueChange: CurrencyInputProps["onValueChange"] = (
    value,
    _name,
    _values
  ) => {
    if (!value) {
      setLocalValue("");
      return;
    }

    setLocalValue(value);
  };

  //   NOTE: What will happen without this useEffect?
  //   ASSUMPTION: maybe not sync the value from react-hook-form to the internal
  //   RESULT: correct assumption
  useEffect(() => {
    let update = value;

    if (!isNaN(Number(value))) {
      update = formatter(value);
    }

    setLocalValue(update);
  }, [value, formatter]);

  const combinedRef = useCombinedRefs(inputRef, ref);

  return (
    <CurrencyInput
      {...rest}
      {...attributes}
      className={cn(
        "text-sm text-[#52525B] cursor-default bg-transparent text-right outline-none"
        // NOTE: commented them because I'm not sure why these styles are neccessary.
        // "w-full flex-1 appearance-none"
      )}
      onValueChange={handleValueChange}
      value={localValue || undefined}
      ref={combinedRef}
      formatValueOnBlur
      onBlur={() => {
        onBlur();
        onInputBlur();
        onChange(localValue, value);
      }}
      decimalScale={0}
      decimalsLimit={0}
      onFocus={onFocus}
      autoComplete="off"
      tabIndex={-1}
    />
  );
};
