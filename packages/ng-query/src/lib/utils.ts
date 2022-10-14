import { QueryClient, QueryObserver, QueryOptions } from '@tanstack/query-core';
import { Subscription, take, tap } from 'rxjs';
import { baseQuery } from './base-query';
import { ObservableQueryFn } from './types';

export function buildQuery<TQueryFnData>(
  client: QueryClient,
  Observer: typeof QueryObserver,
  options: QueryOptions
) {
  const sourceSubscription = new Subscription();

  if (options.queryFn) {
    const originalQueryFn = options.queryFn as ObservableQueryFn<TQueryFnData>;

    options.queryFn = (...queryFnArgs) => {
      return new Promise<TQueryFnData>((res, rej) => {
        const subscription = originalQueryFn(...queryFnArgs)
          .pipe(
            take(1),
            tap({
              unsubscribe: () => {
                client.cancelQueries(options.queryKey);
              },
            })
          )
          .subscribe({
            next: res,
            error: rej,
          });

        sourceSubscription.add(subscription);
      });
    };
  }

  return baseQuery(client, sourceSubscription, Observer, options);
}
