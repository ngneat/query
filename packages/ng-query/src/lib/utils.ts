import {
  QueryClient,
  QueryFunctionContext,
  QueryObserver,
  QueryObserverResult,
  QueryOptions,
} from '@tanstack/query-core';
import { take, tap } from 'rxjs';
import { baseQuery } from './base-query';
import { ObservableQueryFn } from './types';

export function fromQueryFn<TQueryFnData>(
  originalQueryFn: ObservableQueryFn<TQueryFnData>,
  client: QueryClient,
  queryKey: unknown[]
) {
  function queryFn$(queryFnArgs: QueryFunctionContext) {
    return new Promise<TQueryFnData>((res, rej) => {
      const subscription = originalQueryFn(queryFnArgs)
        .pipe(
          take(1),
          tap({
            unsubscribe: () => {
              client.cancelQueries(queryKey);
            },
          })
        )
        .subscribe({
          next: res,
          error: rej,
        });

      queryFnArgs.signal?.addEventListener('abort', () => {
        subscription.unsubscribe();
      });
    });
  }

  return queryFn$;
}

export function buildQuery<TQueryFnData>(
  client: QueryClient,
  Observer: typeof QueryObserver,
  options: QueryOptions
) {
  const originalQueryFn = options.queryFn as ObservableQueryFn<TQueryFnData>;

  options.queryFn &&= fromQueryFn(
    originalQueryFn,
    client,
    options.queryKey as unknown[]
  );

  return baseQuery(client, Observer, options);
}

export function createSyncObserverResult<T>(
  data: T,
  options: Partial<QueryObserverResult<T>> = {}
): QueryObserverResult<T> {
  return {
    data,
    isLoading: false,
    isError: false,
    isSuccess: true,
    status: 'success',
    ...options,
  } as QueryObserverResult<T>;
}

export function someRequestsStatusOf(
  requests: Array<QueryObserverResult> | Record<string, QueryObserverResult>,
  status: QueryObserverResult['status']
) {
  const toArray = Array.isArray(requests) ? requests : Object.values(requests);

  return toArray.some((req) => req.status === status);
}

export function allRequestsStatusOf(
  requests: Array<QueryObserverResult> | Record<string, QueryObserverResult>,
  status: QueryObserverResult['status']
) {
  const toArray = Array.isArray(requests) ? requests : Object.values(requests);

  return !toArray.some((req) => req.status !== status);
}
