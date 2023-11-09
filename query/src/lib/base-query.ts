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
import { Signal, assertInInjectionContext } from '@angular/core';

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
  let queryObserver:
    | QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>
    | undefined;

  const defaultedOptions = client.defaultQueryOptions(options);
  defaultedOptions._optimisticResults = 'optimistic';

  const result$ = new Observable((observer) => {
    // Lazily create the observer when the first subscription is received
    if (!queryObserver) {
      queryObserver = new Observer<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        TQueryKey
      >(client, defaultedOptions);
    }

    observer.next(queryObserver.getOptimisticResult(defaultedOptions));

    const queryObserverDispose = queryObserver.subscribe((result) => {
      observer.next(
        defaultedOptions.notifyOnChangeProps
          ? result
          : queryObserver?.trackResult(result)
      );
    });

    return () => {
      queryObserverDispose();
      queryObserver = undefined;
    };
  }).pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  let cachedSignal: undefined | Signal<any>;

  return {
    result$,
    updateOptions(options: QueryObserver['setOptions']) {
      queryObserver?.setOptions(
        {
          ...defaultedOptions,
          ...options,
        },
        { listeners: false }
      );
    },
    // @experimental signal support
    get result() {
      assertInInjectionContext(function queryResultSignal() {
        // noop
      });

      if (!cachedSignal) {
        cachedSignal = toSignal(this.result$, { requireSync: true });
      }

      return cachedSignal;
    },
  };
}
