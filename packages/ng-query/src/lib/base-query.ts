import {
  notifyManager,
  QueryClient,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from '@tanstack/query-core';
import {
  Observable,
  shareReplay,
  Subject,
  Subscription,
  takeUntil,
  Unsubscribable,
} from 'rxjs';

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

  console.log('NEW OBSERVER INSTANCE');

  const destroy = new Subject();

  (queryObserver as unknown as Unsubscribable).unsubscribe = () => {
    destroy.next(true);
    destroy.complete();
  };

  (queryObserver as unknown as { result$: Observable<unknown> }).result$ =
    new Observable<QueryObserverResult<TData, TError>>((observer) => {
      console.log(
        'NEW OBSERVER SUBSCRIPTION',
        queryObserver.getCurrentQuery().queryKey
      );

      observer.next(queryObserver.getOptimisticResult(defaultedOptions));

      const queryObserverDispose = queryObserver.subscribe((result) => {
        observer.next(
          !defaultedOptions.notifyOnChangeProps
            ? queryObserver.trackResult(result)
            : result
        );
      });

      return () => {
        console.log(
          'OBSERVER UNSUBSCRIBED ',
          queryObserver.getCurrentQuery().queryKey
        );
        sourceSubscription.unsubscribe();
        queryObserverDispose();
      };
    }).pipe(
      takeUntil(destroy.asObservable()),
      shareReplay({
        bufferSize: 1,
        refCount: !defaultedOptions.keepPreviousData,
      })
    );

  return queryObserver;
}
