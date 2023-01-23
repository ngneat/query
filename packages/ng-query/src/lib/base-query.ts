import {
  notifyManager,
  QueryClient,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from '@tanstack/query-core';
import { Observable, shareReplay } from 'rxjs';

export function baseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData
>(
  client: QueryClient,
  Observer: typeof QueryObserver,
  options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData>
) {
  const defaultedOptions = client.defaultQueryOptions(options);
  defaultedOptions._optimisticResults = 'optimistic';

  defaultedOptions.onError &&= notifyManager.batchCalls(
    defaultedOptions.onError
  );

  defaultedOptions.onSuccess &&= notifyManager.batchCalls(
    defaultedOptions.onSuccess
  );

  defaultedOptions.onSettled &&= notifyManager.batchCalls(
    defaultedOptions.onSettled
  );

  const queryObserver = new Observer<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    QueryKey
  >(client, defaultedOptions);

  (queryObserver as unknown as { result$: Observable<unknown> }).result$ =
    new Observable<QueryObserverResult<TData, TError>>((observer) => {
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

  return queryObserver;
}
