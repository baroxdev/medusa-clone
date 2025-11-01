import { Checkbox } from "@medusa-clone/ui";
import { useCombinedRefs } from "../hooks/use-combined-refs";
import { useDataGridCell } from "../hooks/use-data-grid-cell";
import { DataGridCellContainer } from "./data-grid-cell-container";
import { DataGridCellProps, InputProps } from "./types";
import { Controller, ControllerRenderProps } from "react-hook-form";

export const DataGridBooleanCell = <TData, TValue>({
  context,
}: DataGridCellProps<TData, TValue>) => {
  const { control, field, renderProps } = useDataGridCell({ context });
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
  const { ref, value, onBlur, name, disabled } = field;
  const {
    ref: inputRef,
    onBlur: onInputBlur,
    onChange,
    onFocus,
    ...attributes
  } = inputProps;

  const combinedRef = useCombinedRefs(ref, inputRef);
  return (
    <>
      <Checkbox
        // Do this later
        // disabled={disabled || fieldDisabled}

        disabled={disabled}
        name={name}
        checked={value}
        onCheckedChange={(newValue) => onChange(newValue === true, value)}
        onFocus={onFocus}
        onBlur={() => {
          onBlur();
          onInputBlur();
        }}
        ref={combinedRef}
        tabIndex={-1}
        {...attributes}
      />
    </>
  );
};
