export { UseQuery as QueryProvider } from './lib/query';
export { MutationProvider } from './lib/mutation';

export { UseInfiniteQuery as InfiniteQueryProvider } from './lib/infinite-query';
export { QUERY_CLIENT_OPTIONS as QUERY_CLIENT_CONFIG } from './lib/providers';
export { QueryClientService as QueryClient } from './lib/query-client';
export { useMutationResult } from './lib/mutation-result';

export * from './lib/operators';
export { UseIsFetching as IsFetchingProvider } from './lib/is-fetching';
export { UseIsMutating as IsMutatingProvider } from './lib/is-mutating';
export {
  UsePersistedQuery as PersistedQueryProvider,
  queryOptions,
} from './lib/persisted-query';
export { fromQueryFn, createSyncObserverResult } from './lib/utils';
export * from './lib/entity-utils';
