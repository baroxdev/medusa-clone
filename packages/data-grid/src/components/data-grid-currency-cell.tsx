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

export const DataGridCurrencyCell = <TData, TValue>({
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
  const { value, ref, onFocus, onBlur, onChange, ...rest } = inputProps;
  const formatter = useCallback((value?: string | number) => {
    const ensuredValue =
      typeof value === "number" ? value.toString() : value || "";
    return formatValue({
      value: ensuredValue,
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
  //   useEffect(() => {
  //     let update = value;

  //     if (!isNaN(Number(value))) {
  //       update = formatter(value);
  //     }

  //     setLocalValue(update);
  //     console.log({ update });
  //   }, [value, formatter]);

  const combinedRef = useCombinedRefs(ref);
  return (
    <CurrencyInput
      {...rest}
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

        // NOTE: only save on blur
        onChange(localValue, value);
      }}
      decimalScale={1}
      decimalsLimit={0}
      onFocus={onFocus}
      autoComplete="off"
      tabIndex={-1}
    />
  );
};
