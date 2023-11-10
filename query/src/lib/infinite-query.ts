import {
  assertInInjectionContext,
  inject,
  Injectable,
  InjectionToken,
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
import { createBaseQuery } from './base-query';
import { Result } from './types';

type CreateInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
> = WithRequired<
  InfiniteQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey,
    TPageParam
  >,
  'queryKey'
>;

type CreateInfiniteQueryResult<TData = unknown, TError = DefaultError> = Result<
  InfiniteQueryObserverResult<TData, TError>
>;

@Injectable({ providedIn: 'root' })
class InfiniteQuery {
  #instance = injectQueryClient();

  use<
    TQueryFnData,
    TError = DefaultError,
    TData = InfiniteData<TQueryFnData>,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown
  >(
    options: CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      TPageParam
    >
  ): CreateInfiniteQueryResult<TData, TError> {
    return createBaseQuery({
      client: this.#instance,
      Observer: InfiniteQueryObserver as typeof QueryObserver,
      options,
    });
  }
}

const UseInfiniteQuery = new InjectionToken<InfiniteQuery['use']>('UseQuery', {
  providedIn: 'root',
  factory() {
    const query = new InfiniteQuery();

    return query.use.bind(query);
  },
});

export function injectInfiniteQuery() {
  assertInInjectionContext(injectInfiniteQuery);

  return inject(UseInfiniteQuery);
}
