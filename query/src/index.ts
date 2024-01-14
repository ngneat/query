export { injectInfiniteQuery } from './lib/infinite-query';
export { injectIsFetching } from './lib/is-fetching';
export { injectIsMutating } from './lib/is-mutating';
export { injectMutation } from './lib/mutation';
export { injectQuery } from './lib/query';
export {
  QueryClient,
  injectQueryClient,
  provideQueryClient,
} from './lib/query-client';

export * from '@tanstack/query-core';
export * from './lib/operators';
export { provideQueryClientOptions } from './lib/query-client-options';
export { queryOptions } from './lib/query-options';
export { intersectResults } from './lib/signals';
export { ObservableQueryResult, SignalQueryResult } from './lib/types';
export {
  createPendingObserverResult,
  createSuccessObserverResult,
  toPromise,
} from './lib/utils';
