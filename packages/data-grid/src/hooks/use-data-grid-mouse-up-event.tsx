import React from "react";

type UseDataGridMouseUpEventOptions = {
  setIsSelecting: (value: boolean) => void;
};

export const useDataGridMouseUpEvent = ({
  setIsSelecting,
}: UseDataGridMouseUpEventOptions) => {
  const handleMouseUp = React.useCallback(() => {
    setIsSelecting(false);
  }, [setIsSelecting]);

  return {
    handleMouseUp,
  };
};
