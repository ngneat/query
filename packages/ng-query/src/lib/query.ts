import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  DefaultError,
  QueryKey,
  QueryObserver,
  QueryOptions,
} from '@tanstack/query-core';

import { QueryClientService } from './query-client';
import {
  NgBaseQueryOptions,
  NgDefinedInitialDataQueryOptions,
  NgQueryObserverDefinedReturnType,
  NgQueryObserverUndefinedReturnType,
  NgUndefinedInitialDataQueryOptions,
} from './types';
import { buildQuery } from './utils';

@Injectable({ providedIn: 'root' })
export class QueryService {
  #instance = inject(QueryClientService);

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: NgBaseQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >
  ): NgQueryObserverUndefinedReturnType<TQueryFnData, TError, TData, TQueryKey>;

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: NgUndefinedInitialDataQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey
    >
  ): NgQueryObserverUndefinedReturnType<TQueryFnData, TError, TData, TQueryKey>;

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: NgDefinedInitialDataQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey
    >
  ):
    | NgQueryObserverDefinedReturnType<TQueryFnData, TError, TData, TQueryKey>
    | NgQueryObserverUndefinedReturnType<
        TQueryFnData,
        TError,
        TData,
        TQueryKey
      > {
    return buildQuery(
      this.#instance,
      QueryObserver,
      options as QueryOptions
    ) as unknown as NgQueryObserverUndefinedReturnType<
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
