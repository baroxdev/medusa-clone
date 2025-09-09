import { useCallback } from "react";

const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

export const useDataGridKeydownEvent = () => {
  const handleKeyboardNavigation = useCallback((e: KeyboardEvent) => {}, []);

  const handleKeyDownEvent = useCallback((e: KeyboardEvent) => {
    console.log({ Key: e.key });

    if (ARROW_KEYS.includes(e.key)) {
      handleKeyboardNavigation(e);
      return;
    }
  }, []);

  return {
    handleKeyDownEvent,
  };
};
