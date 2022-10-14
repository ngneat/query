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
import { Observable } from 'rxjs';

import { QueryClient } from './query-client';
import { ObservableQueryFn } from './types';
import { buildQuery } from './utils';
type NgQueryObserverOptions<
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

type NgQueryObserverReturnType<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Observable<QueryObserverResult<TData, TError>> & {
  instance: QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
};

type NgQueryObserverDefinedReturnType<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Observable<DefinedQueryObserverResult<TData, TError>> & {
  instance: QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
};

@Injectable({ providedIn: 'root' })
class Query {
  private instance = inject(QueryClient);

  use<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: Omit<
      NgQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>,
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
      NgQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>,
      'initialData'
    > & { initialData: TQueryFnData | (() => TQueryFnData) }
  ): NgQueryObserverDefinedReturnType<TQueryFnData, TError, TData, TQueryKey>;

  use<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: NgQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>
  ): NgQueryObserverReturnType<TQueryFnData, TError, TData, TQueryKey>;

  use<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    queryKey: TQueryKey,
    options?: Omit<
      NgQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>,
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
      NgQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>,
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
      NgQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>,
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
      NgQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>,
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
      NgQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>,
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
      | NgQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>,
    arg2?:
      | ObservableQueryFn<TQueryFnData, TQueryKey>
      | NgQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>,
    arg3?: NgQueryObserverOptions<TQueryFnData, TError, TData, TQueryKey>
  ): NgQueryObserverReturnType<TQueryFnData, TError, TData, TQueryKey> {
    const parsedOptions = parseQueryArgs(
      arg1,
      arg2 as any,
      arg3
    ) as QueryOptions;

    return buildQuery(this.instance, QueryObserver, parsedOptions);
  }
}

export const QueryProvider = new InjectionToken<Query['use']>('QueryProvider', {
  providedIn: 'root',
  factory() {
    const query = new Query();
    return query.use.bind(query);
  },
});
