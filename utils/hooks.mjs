import { useCallback, useState } from "./preact.mjs";

export function useRerender() {
  const [, setCounter] = useState(() => Date.now());

  return useCallback(() => {
    setCounter(Date.now());
  });
}