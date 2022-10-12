import {
  notifyManager,
  QueryClient,
  QueryFunctionContext,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from '@tanstack/query-core';
import { Subscription, take, tap, Observable } from 'rxjs';

export function baseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData
>(
  client: QueryClient,
  queryKey: QueryKey,
  queryFn: (
    context: QueryFunctionContext<QueryKey>
  ) => Observable<TQueryFnData>,
  Observer: typeof QueryObserver,
  options?: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData>
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

  const sourceSubscription = new Subscription();

  const queryObserver = new Observer<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    QueryKey
  >(client, {
    queryKey,
    queryFn: (...queryFnArgs) => {
      return new Promise<TQueryFnData>((res, rej) => {
        const subscription = queryFn(...queryFnArgs)
          .pipe(
            take(1),
            tap({
              unsubscribe: () => {
                console.log('unsubscribe on destroy from ', queryKey);
                client.cancelQueries(queryKey);
              },
            })
          )
          .subscribe({
            next: res,
            error: rej,
          });

        sourceSubscription.add(subscription);
      });
    },
    ...defaultedOptions,
  });

  const $ = new Observable<QueryObserverResult<TData, TError>>((observer) => {
    const initialResult = {
      ...queryObserver.getOptimisticResult({
        queryKey,
        ...defaultedOptions,
      }),
    };

    observer.next(initialResult);

    const queryObserverDispose = queryObserver.subscribe(
      notifyManager.batchCalls((result: any) => {
        observer.next(
          !defaultedOptions.notifyOnChangeProps
            ? queryObserver.trackResult(result)
            : result
        );
      })
    );

    return () => {
      console.log('infinite queryObserver unsubscribed ', queryKey);
      sourceSubscription.unsubscribe();
      queryObserverDispose();
    };
  }) as any;

  $['instance'] = queryObserver;

  return $;
}
