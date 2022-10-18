import {
  QueryClient,
  QueryFunctionContext,
  QueryObserver,
  QueryOptions,
} from '@tanstack/query-core';
import { Subscription, take, tap } from 'rxjs';
import { baseQuery } from './base-query';
import { ObservableQueryFn } from './types';

export const SUBSCRIPTION = Symbol('SUBSCRIPTION');

export function fromQueryFn<TQueryFnData>(
  originalQueryFn: ObservableQueryFn<TQueryFnData>,
  client: QueryClient,
  queryKey: unknown[]
) {
  let sourceSubscription: Subscription | null = new Subscription();

  function queryFn$(queryFnArgs: QueryFunctionContext) {
    return new Promise<TQueryFnData>((res, rej) => {
      const subscription = originalQueryFn(queryFnArgs)
        .pipe(
          take(1),
          tap({
            unsubscribe: () => {
              client.cancelQueries(queryKey);
              sourceSubscription = null;
            },
          })
        )
        .subscribe({
          next: res,
          error: rej,
        });

      sourceSubscription?.add(subscription);
    });
  }

  (queryFn$ as any)[SUBSCRIPTION] = sourceSubscription;

  return queryFn$;
}

export function buildQuery<TQueryFnData>(
  client: QueryClient,
  Observer: typeof QueryObserver,
  options: QueryOptions
) {
  const originalQueryFn = options.queryFn as ObservableQueryFn<TQueryFnData>;

  options.queryFn &&= fromQueryFn(
    originalQueryFn,
    client,
    options.queryKey as unknown[]
  );

  return baseQuery(client, Observer, options);
}
