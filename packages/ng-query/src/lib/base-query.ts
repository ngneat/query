import {
  notifyManager,
  QueryClient,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from '@tanstack/query-core';
import { Observable, Subscription } from 'rxjs';

export function baseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData
>(
  client: QueryClient,
  sourceSubscription: Subscription,
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

  const $ = new Observable<QueryObserverResult<TData, TError>>((observer) => {
    observer.next(queryObserver.getOptimisticResult(defaultedOptions));

    const queryObserverDispose = queryObserver.subscribe(
      notifyManager.batchCalls((result) => {
        observer.next(
          !defaultedOptions.notifyOnChangeProps
            ? queryObserver.trackResult(result)
            : result
        );
      })
    );

    return () => {
      console.log(
        'infinite queryObserver unsubscribed ',
        defaultedOptions.queryKey
      );
      sourceSubscription.unsubscribe();
      queryObserverDispose();
    };
  }) as any;

  $['instance'] = queryObserver;

  return $;
}
