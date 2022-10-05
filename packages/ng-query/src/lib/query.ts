import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  notifyManager,
  QueryFunctionContext,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
} from '@tanstack/query-core';
import { Observable, Subscription, take, tap } from 'rxjs';

import { QUERY_CLIENT } from './query-client';
import { NgQueryObserverResult } from './types';

@Injectable({ providedIn: 'root' })
class Query {
  private instance = inject(QUERY_CLIENT);

  query<TQueryFnData, TError, TData>(
    queryKey: QueryKey,
    queryFn: (context: QueryFunctionContext<QueryKey>) => Observable<TData>,
    options?: Omit<
      QueryObserverOptions<TQueryFnData, TError, TData, QueryKey>,
      'queryKey' | 'queryFn'
    >
  ): Observable<NgQueryObserverResult<TData, TError>> & {
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

    const queryObserver = new QueryObserver<
      TQueryFnData,
      TError,
      TData,
      QueryKey
    >(this.instance, {
      ...defaultedOptions,
      queryKey,
      queryFn: (...queryFnArgs) => {
        return new Promise<TData>((res, rej) => {
          const subscription = queryFn(...queryFnArgs)
            .pipe(
              take(1),
              tap({
                unsubscribe: () => {
                  console.log('unsubscribe from ', queryKey);
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
        notifyManager.batchCalls((result) => {
          observer.next(
            !defaultedOptions.notifyOnChangeProps
              ? queryObserver.trackResult(result)
              : result
          );
        })
      );

      return () => {
        console.log('queryObserver unsubscribed ', queryKey);
        sourceSubscription.unsubscribe();
        queryObserverDispose();
      };
    }) as any;

    $['instance'] = queryObserver;

    return $;
  }
}

export const QueryProvider = new InjectionToken<Query['query']>(
  'QueryProvider',
  {
    providedIn: 'root',
    factory() {
      const query = new Query();
      return query.query.bind(query);
    },
  }
);
