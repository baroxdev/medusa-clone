import React from "react";
import { DataGridCellContainerProps } from "./types";
import { cn } from "@medusa-clone/ui";

export const DataGridCellContainer: React.FC<
  Partial<DataGridCellContainerProps>
> = ({
  children,
  isSelected,
  innerProps,
  showOverlay,
  overlayProps,
  isAnchor,
}) => {
  return (
    <div className="group/container relative size-full">
      <div
        className={cn(
          "bg-white flex items-center px-4 py-2.5 size-full gap-x-2 outline-none",
          isSelected && "bg-blue-100",
          {
            "ring-2 ring-inset ring-blue-500": isAnchor,
          }
        )}
        tabIndex={-1}
        {...innerProps}
      >
        <div className="relative z-[1] size-full flex items-center justify-center">
          {children}
        </div>

        {showOverlay && (
          <div
            {...overlayProps}
            data-cell-overlay="true"
            className="absolute inset-0 z-[2]"
          />
        )}
      </div>
    </div>
  );
};
