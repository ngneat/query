import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  InfiniteQueryObserver,
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult,
  parseQueryArgs,
  QueryKey,
  QueryObserver,
  QueryOptions,
} from '@tanstack/query-core';
import { Observable, Unsubscribable } from 'rxjs';
import { QueryClientService } from './query-client';
import { ObservableQueryFn } from './types';
import { buildQuery } from './utils';

type NgQueryObserverOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Omit<
  InfiniteQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
  'queryFn'
> & {
  queryFn: ObservableQueryFn<TQueryFnData, TQueryKey>;
};

type NgInfiniteQueryObserverReturnType<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Unsubscribable & {
  result$: Observable<InfiniteQueryObserverResult<TData, TError>>;
} & Omit<
    InfiniteQueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
    'subscribe'
  >;
@Injectable({ providedIn: 'root' })
export class InfiniteQueryService {
  private instance = inject(QueryClientService);

  use<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: NgQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >
  ): NgInfiniteQueryObserverReturnType<TData, TError>;

  use<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: TQueryKey,
    options?: Omit<
      NgQueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey
      >,
      'queryKey'
    >
  ): NgInfiniteQueryObserverReturnType<TData, TError>;

  use<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: TQueryKey,
    queryFn: ObservableQueryFn<TQueryFnData, TQueryKey>,
    options?: Omit<
      NgQueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey
      >,
      'queryKey' | 'queryFn'
    >
  ): NgInfiniteQueryObserverReturnType<TData, TError>;

  use<
    TQueryFnData,
    TError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    arg1:
      | TQueryKey
      | NgQueryObserverOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryFnData,
          TQueryKey
        >,
    arg2?:
      | ObservableQueryFn<TQueryFnData, TQueryKey>
      | NgQueryObserverOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryFnData,
          TQueryKey
        >,
    arg3?: NgQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >
  ): NgInfiniteQueryObserverReturnType<TData, TError> {
    const parsedOptions = parseQueryArgs(
      arg1,
      arg2 as any,
      arg3
    ) as QueryOptions;

    return buildQuery(
      this.instance,
      InfiniteQueryObserver as typeof QueryObserver,
      parsedOptions
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
