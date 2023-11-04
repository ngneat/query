import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  DefaultError,
  InfiniteQueryObserver,
  QueryKey,
  QueryObserver, QueryOptions
} from '@tanstack/query-core';
import { QueryClientService } from './query-client';
import {
  NgInfiniteQueryObserverOptions,
  NgInfiniteQueryObserverReturnType,
} from './types';
import { buildQuery } from './utils';

@Injectable({ providedIn: 'root' })
export class InfiniteQueryService {
  private instance = inject(QueryClientService);

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown
  >(
    options: NgInfiniteQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      TPageParam
    >
  ): NgInfiniteQueryObserverReturnType<TData, TError> {
    return buildQuery(
      this.instance,
      InfiniteQueryObserver as typeof QueryObserver,
      options as unknown as QueryOptions
    ) as unknown as NgInfiniteQueryObserverReturnType<TData, TError>;
  }
}

export type UseInfiniteQuery = InfiniteQueryService['use'];

export const UseInfiniteQuery = new InjectionToken<UseInfiniteQuery>(
  'UseInfiniteQuery',
  {
    providedIn: 'root',
    factory() {
      const query = new InfiniteQueryService();
      return query.use.bind(query);
    },
  }
);
