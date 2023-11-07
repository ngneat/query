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
import { assertInInjectionContext } from '@angular/core';

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
    const mergedOptions = client.defaultQueryOptions(
      client.defaultQueryOptions(options)
    );

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
    __cached__: undefined,
    // @experimental signal support
    get result() {
      assertInInjectionContext(function queryResultSignal() {
        // noop
      });

      if (!this.__cached__) {
        this.__cached__ = toSignal(this.result$);
      }

      return this.__cached__;
    },
  };
}
