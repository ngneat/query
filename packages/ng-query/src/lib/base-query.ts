import {
  DefaultedQueryObserverOptions,
  notifyManager,
  QueryKey,
  QueryObserver,
  QueryObserverResult,
} from '@tanstack/query-core';
import { Observable } from 'rxjs';

export function notify<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: DefaultedQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >
) {
  options.onError &&= notifyManager.batchCalls(options.onError);

  options.onSuccess &&= notifyManager.batchCalls(options.onSuccess);

  options.onSettled &&= notifyManager.batchCalls(options.onSettled);
}

export function baseResults<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryObserver: QueryObserver<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
  queryKey: TQueryKey,
  options: DefaultedQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
  onDestroy: () => void
): Observable<QueryObserverResult<TData, TError>> {
  return new Observable((observer) => {
    const initialResult: QueryObserverResult<TData, TError> = {
      ...queryObserver.getOptimisticResult({
        queryKey,
        ...options,
      }),
    };

    observer.next(initialResult);

    const queryObserverDispose = queryObserver.subscribe(
      notifyManager.batchCalls((result) => {
        observer.next(
          !options.notifyOnChangeProps
            ? queryObserver.trackResult(result)
            : result
        );
      })
    );

    return () => {
      console.log('queryObserver unsubscribed ', queryKey);
      onDestroy();
      queryObserverDispose();
    };
  });
}
