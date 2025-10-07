import { useCallback } from "react";
import { DataGridUpdateCommand } from "../models/data-grid-update-command";

type UseDataGridCellHandlersOptions = {
  setValue: any;
};

export const useDataGridCellHandlers = ({
  setValue,
}: UseDataGridCellHandlersOptions) => {
  // Simple version as I usually do
  //   const getInputChangeHandler = useCallback((field: any) => {
  //     return (next: any, prev: any) => {
  //       console.log({ field, next, prev });
  //       setValue(field, next);
  //     };
  //   }, []);

  // Medusa's version
  const getInputChangeHandler = useCallback((field: any) => {
    return (next: any, prev: any) => {
      const command = new DataGridUpdateCommand({
        prev,
        next,
        setter: (value) => {
          setValue(field, value);
        },
      });

      // BUG: Implement with command history later
      command.execute();
    };
  }, []);

  return {
    getInputChangeHandler,
  };
};
