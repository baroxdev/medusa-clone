import { RefObject, useEffect, useRef } from "react";
import { DataGridQueryTool } from "../models/data-grid-query-tool";

/**
 * Why did they initialized the query tool with hook instead of useMemo?
 * @param containerRef
 * @returns
 */
export const useDataGridQueryTool = (containerRef: RefObject<HTMLElement>) => {
  const queryToolRef = useRef<DataGridQueryTool | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      queryToolRef.current = new DataGridQueryTool(containerRef.current);
    }
  }, [containerRef]);

  return queryToolRef.current;
};
