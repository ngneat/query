import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  DefinedQueryObserverResult,
  parseQueryArgs,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
  QueryOptions,
} from '@tanstack/query-core';
import { Observable, Unsubscribable } from 'rxjs';

import { QueryClient } from './query-client';
import { ObservableQueryFn } from './types';
import { buildQuery } from './utils';

export type NgQueryObserverOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Omit<
  QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  'queryFn'
> & {
  queryFn: ObservableQueryFn<TQueryFnData, TQueryKey>;
};

export type NgQueryObserverReturnType<
  TQueryFnData = unknown,
  TError = unknown,
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
  TError = unknown,
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
export class Query {
  private instance = inject(QueryClient);

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
  ): NgQueryObserverReturnType<TQueryFnData, TError, TData, TQueryKey>;

  use<
    TQueryFnData = unknown,
    TError = unknown,
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
    TError = unknown,
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
  ): NgQueryObserverDefinedReturnType<TQueryFnData, TError, TData, TQueryKey>;

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
      'queryKey' | 'initialData'
    > & { initialData?: () => undefined }
  ): NgQueryObserverReturnType<TQueryFnData, TError, TData, TQueryKey>;

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
      'queryKey' | 'initialData'
    > & { initialData: TQueryFnData | (() => TQueryFnData) }
  ): NgQueryObserverDefinedReturnType<TQueryFnData, TError, TData, TQueryKey>;

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
  ): NgQueryObserverReturnType<TQueryFnData, TError, TData, TQueryKey>;

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
      'queryKey' | 'queryFn' | 'initialData'
    > & { initialData?: () => undefined }
  ): NgQueryObserverReturnType<TQueryFnData, TError, TData, TQueryKey>;

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
  ): NgQueryObserverReturnType<TQueryFnData, TError, TData, TQueryKey>;

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
  ):
    | NgQueryObserverReturnType<TQueryFnData, TError, TData, TQueryKey>
    | NgQueryObserverDefinedReturnType<TQueryFnData, TError, TData, TQueryKey> {
    const parsedOptions = parseQueryArgs(
      arg1,
      arg2 as any,
      arg3
    ) as QueryOptions;

    return buildQuery(
      this.instance,
      QueryObserver,
      parsedOptions
    ) as unknown as NgQueryObserverReturnType<
      TQueryFnData,
      TError,
      TData,
      TQueryKey
    >;
  }
}

export type UseQuery = Query['use'];

export const QueryProvider = new InjectionToken<UseQuery>('QueryProvider', {
  providedIn: 'root',
  factory() {
    const query = new Query();
    return query.use.bind(query);
  },
});
