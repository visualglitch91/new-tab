import { useMemo } from "react";
import { debounce } from "lodash";
import useLatestRef from "./useLatestRef";

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T
) {
  const callbackRef = useLatestRef(callback);

  return useMemo(() => {
    return debounce((...args) => {
      callbackRef.current(...args);
    });
  }, [callbackRef]) as unknown as T;
}
