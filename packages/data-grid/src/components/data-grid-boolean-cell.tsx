import { Button, Checkbox } from "@medusa-clone/ui";
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
  const { ref, value, ...props } = inputProps;
  console.log({ props });
  const combinedRef = useCombinedRefs(ref);
  return (
    <>
      <Button>Test</Button>
      <Checkbox />
      <input
        // type="checkbox"
        ref={combinedRef}
        value={value}
        className="cursor-pointer"
        //   {...props}
      />
    </>
  );
};
