import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  notifyManager,
  QueryFunctionContext,
  QueryObserver,
  QueryObserverOptions,
} from '@tanstack/query-core';
import { Observable, Subscription, take, tap } from 'rxjs';

import { QUERY_CLIENT } from './query-client';
import { NgQueryObserverResult } from './types';

@Injectable({ providedIn: 'root' })
class Query {
  private instance = inject(QUERY_CLIENT);

  query<T>(
    queryKey: unknown[],
    source: (context: QueryFunctionContext) => Observable<T>,
    options?: Omit<QueryObserverOptions<T>, 'queryKey' | 'queryFn'>
  ): Observable<NgQueryObserverResult<T>> & {
    instance: QueryObserver<T>;
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

    const queryObserver = new QueryObserver<T>(this.instance, {
      ...defaultedOptions,
      queryKey,
      queryFn: (...args) => {
        return new Promise((res, rej) => {
          const subscription = source(...args)
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
        });
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
          (result as NgQueryObserverResult<T>).queryKey = queryKey;
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
