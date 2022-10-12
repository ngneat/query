import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  QueryFunctionContext,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
} from '@tanstack/query-core';
import { Observable, Subscription, take, tap } from 'rxjs';
import { notify, baseResults } from './base-query';

import { QueryClient } from './query-client';
import { NgQueryObserverResult } from './types';

@Injectable({ providedIn: 'root' })
class Query {
  private instance = inject(QueryClient);

  use<TQueryFnData, TError, TData>(
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

    notify(defaultedOptions);

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

    const $ = baseResults(queryObserver, queryKey, defaultedOptions, () => {
      sourceSubscription.unsubscribe();
    }) as any;

    $['instance'] = queryObserver;

    return $;
  }
}

export const QueryProvider = new InjectionToken<Query['use']>('QueryProvider', {
  providedIn: 'root',
  factory() {
    const query = new Query();
    return query.use.bind(query);
  },
});
