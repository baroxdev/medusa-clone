import { CurrencyInput, CurrencyInputProps } from "react-currency-input-field";

import { useDataGridCell } from "../hooks/use-data-grid-cell";
import { DataGridCellContainer } from "./data-grid-cell-container";
import { DataGridCellProps, InputProps } from "./types";
import { useCombinedRefs } from "../hooks/use-combined-refs";
import { useState } from "react";

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
  const { ref, value, onFocus, onBlur, onChange } = inputProps;

  const [localValue, setLocalValue] = useState<string | number>(value || "");

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

  const combinedRef = useCombinedRefs(ref);
  return (
    <CurrencyInput
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
