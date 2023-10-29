import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  DefaultError,
  InfiniteData,
  InfiniteQueryObserver,
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult,
  QueryKey,
  QueryObserver,
} from '@tanstack/query-core';
import { Observable, Unsubscribable } from 'rxjs';
import { QueryClientService } from './query-client';
import { ObservableQueryFn } from './types';
import { buildQuery } from './utils';

type NgQueryObserverOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
> = Omit<
  InfiniteQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey,
    TPageParam
  >,
  'queryFn'
> & {
  queryFn: ObservableQueryFn<TQueryFnData, TQueryKey, TPageParam>;
};

type NgInfiniteQueryObserverReturnType<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
> = Unsubscribable & {
  result$: Observable<
    InfiniteQueryObserverResult<InfiniteData<TQueryData, TPageParam>, TError>
  >;
} & Omit<
    InfiniteQueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
    'subscribe'
  >;

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
    options: NgQueryObserverOptions<
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
      options as any
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
