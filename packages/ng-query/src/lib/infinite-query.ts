import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  QueryKey,
  QueryFunctionContext,
  InfiniteQueryObserverOptions,
  QueryObserver,
  notifyManager,
  InfiniteQueryObserver,
} from '@tanstack/query-core';
import { Observable, Subscription, take, tap } from 'rxjs';

import { QueryClient } from './query-client';
import { NgInfiniteQueryObserverResult } from './types';

@Injectable({ providedIn: 'root' })
class InfiniteQuery {
  private instance = inject(QueryClient);
  use<TQueryFnData, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    queryFn: (context: QueryFunctionContext<QueryKey>) => Observable<TData>,
    options?: Omit<
      InfiniteQueryObserverOptions<TQueryFnData, TError, TData, QueryKey>,
      'queryKey' | 'queryFn'
    >
  ): Observable<NgInfiniteQueryObserverResult<TData, TError>> & {
    instance: QueryObserver<TQueryFnData, TError, TData, QueryKey>;
  } {
    const defaultedOptions = this.instance.defaultQueryOptions(options);

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

    const queryObserver = new InfiniteQueryObserver<
      TQueryFnData,
      TError,
      TData,
      QueryKey
    >(this.instance, {
      queryKey,
      queryFn: (...queryFnArgs) => {
        return new Promise<TData>((res, rej) => {
          const subscription = queryFn(...queryFnArgs)
            .pipe(
              take(1),
              tap({
                unsubscribe: () => {
                  console.log('unsubscribe on destroy from ', queryKey);
                  this.instance.cancelQueries(queryKey);
                },
              })
            )
            .subscribe({
              next: res,
              error: rej,
            });

          sourceSubscription.add(subscription);
        }) as any;
      },
      getNextPageParam: defaultedOptions.getNextPageParam,
      getPreviousPageParam: defaultedOptions.getPreviousPageParam,
    });

    const $ = new Observable((observer) => {
      const initialResult = {
        ...queryObserver.getOptimisticResult({
          queryKey,
          ...defaultedOptions,
        }),
        queryKey,
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
}

export const InfiniteQueryProvider = new InjectionToken<InfiniteQuery['use']>(
  'InfiniteQueryProvider',
  {
    providedIn: 'root',
    factory() {
      const query = new InfiniteQuery();
      return query.use.bind(query);
    },
  }
);
