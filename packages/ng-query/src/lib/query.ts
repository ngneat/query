import {inject, Injectable, InjectionToken} from '@angular/core';
import {
  DefaultError,
  DefinedQueryObserverResult,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult, QueryOptions
} from '@tanstack/query-core';
import {Observable, Unsubscribable} from 'rxjs';

import {QueryClientService} from './query-client';
import {ObservableQueryFn} from './types';
import {buildQuery} from './utils';

export type NgQueryObserverOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Omit<
  QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  'queryFn'
> & {
  queryFn?: ObservableQueryFn<TQueryFnData, TQueryKey>;
};

export type NgQueryObserverReturnType<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Unsubscribable & {
  result$: Observable<QueryObserverResult<TData, TError>>;
} & Omit<
    QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
    'subscribe'
  >;

type NgQueryObserverDefinedReturnType<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = {
  result$: Observable<DefinedQueryObserverResult<TData, TError>>;
} & Omit<
  QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  'subscribe'
>;

@Injectable({ providedIn: 'root' })
export class QueryService {
  private instance = inject(QueryClientService);

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
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
  ): NgQueryObserverReturnType<TQueryFnData, TError, TData, TQueryKey>;

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: Omit<
      NgQueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey
      >,
      'initialData'
    > & { initialData?: () => undefined }
  ): NgQueryObserverReturnType<TQueryFnData, TError, TData, TQueryKey>;

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: Omit<
      NgQueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey
      >,
      'initialData'
    > & { initialData: TQueryFnData | (() => TQueryFnData) }
  ): NgQueryObserverReturnType<TQueryFnData, TError, TData, TQueryKey> | NgQueryObserverDefinedReturnType<TQueryFnData, TError, TData, TQueryKey> {
    return buildQuery(
      this.instance,
      QueryObserver,
      options as QueryOptions
    ) as unknown as NgQueryObserverReturnType<
      TQueryFnData,
      TError,
      TData,
      TQueryKey
    >;
  }
}

export type UseQuery = QueryService['use'];

export const UseQuery = new InjectionToken<UseQuery>('UseQuery', {
  providedIn: 'root',
  factory() {
    const query = new QueryService();
    return query.use.bind(query);
  },
});
