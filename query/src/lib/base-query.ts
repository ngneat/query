import {
  DefaultError,
  QueryClient,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
  WithRequired,
} from '@tanstack/query-core';
import { Observable, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Result } from './types';

export type CreateBaseQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = WithRequired<
  QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  'queryKey'
>;

export type CreateBaseQueryResult<
  TData = unknown,
  TError = DefaultError
> = Result<QueryObserverResult<TData, TError>>;

export function createBaseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
>({
  client,
  Observer,
  options,
}: {
  client: QueryClient;
  Observer: typeof QueryObserver;
  options: CreateBaseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >;
}): any {
  const defaultedOptions = client.defaultQueryOptions(options);
  defaultedOptions._optimisticResults = 'optimistic';

  const queryObserver = new Observer<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >(client, defaultedOptions);

  const result$ = new Observable((observer) => {
    const mergedOptions = client.defaultQueryOptions({
      ...options,
      // The query key can be changed, so we need to rebuild it each time
      ...queryObserver.options,
    });

    observer.next(queryObserver.getOptimisticResult(mergedOptions));

    const queryObserverDispose = queryObserver.subscribe((result) => {
      observer.next(
        !defaultedOptions.notifyOnChangeProps
          ? queryObserver.trackResult(result)
          : result
      );
    });

    return () => {
      queryObserverDispose();
    };
  }).pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  return {
    result$,
    setOptions: queryObserver.setOptions.bind(queryObserver),
    toSignal: () => toSignal(result$),
  };
}
