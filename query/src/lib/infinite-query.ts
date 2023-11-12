import {
  assertInInjectionContext,
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { injectQueryClient } from './query-client';

import {
  DefaultError,
  InfiniteData,
  QueryKey,
  QueryObserver,
  InfiniteQueryObserver,
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult,
  WithRequired,
} from '@tanstack/query-core';
import { createBaseQuery, Options } from './base-query';
import { Result } from './types';

interface CreateInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> extends WithRequired<
      InfiniteQueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        TQueryKey,
        TPageParam
      >,
      'queryKey'
    >,
    Options {}

@Injectable({ providedIn: 'root' })
class InfiniteQuery {
  #instance = injectQueryClient();
  #injector = inject(Injector);

  use<
    TQueryFnData,
    TError = DefaultError,
    TData = InfiniteData<TQueryFnData>,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown,
  >(
    options: CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      TPageParam
    >,
  ): Result<InfiniteQueryObserverResult<TData, TError>> {
    return createBaseQuery({
      client: this.#instance,
      injector: options.injector ?? this.#injector,
      Observer: InfiniteQueryObserver as typeof QueryObserver,
      options,
    });
  }
}

export function injectInfiniteQuery(options?: { injector?: Injector }) {
  if (options?.injector) {
    return runInInjectionContext(options.injector, () => {
      const query = inject(InfiniteQuery);

      return query.use.bind(query);
    });
  }

  assertInInjectionContext(injectInfiniteQuery);

  const query = inject(InfiniteQuery);

  return query.use.bind(query);
}
