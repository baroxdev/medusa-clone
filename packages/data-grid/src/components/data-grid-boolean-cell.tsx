import { Checkbox } from "@medusa-clone/ui";
import { useCombinedRefs } from "../hooks/use-combined-refs";
import { useDataGridCell } from "../hooks/use-data-grid-cell";
import { DataGridCellContainer } from "./data-grid-cell-container";
import { DataGridCellProps, InputProps } from "./types";

export const DataGridBooleanCell = <TData, TValue>({
  context,
}: DataGridCellProps<TData, TValue>) => {
  const { renderProps } = useDataGridCell({ context });
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
    onChange,
    onFocus,
    onBlur,
    ...attributes
  } = inputProps;

  const combinedRef = useCombinedRefs(inputRef);
  return (
    <>
      <Checkbox
        tabIndex={-1}
        onCheckedChange={(newValue) => onChange(newValue === true, value)}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={combinedRef}
        {...attributes}
      />
    </>
  );
};
