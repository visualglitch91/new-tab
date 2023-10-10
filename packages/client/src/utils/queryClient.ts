import { QueryClient, useMutation } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { cacheTime: Infinity } },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  //@ts-ignore
  queryClient,
  persister: localStoragePersister,
});

export function useGenericMutation<T, R>({
  onResolve,
}: {
  onResolve?: (result: T) => Promise<R>;
} = {}) {
  return useMutation((func: () => Promise<T>) =>
    //@ts-expect-error
    func().then(onResolve || ((f) => f))
  );
}
