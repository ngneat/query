import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  QueryFunctionContext,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
} from '@tanstack/query-core';
import { Observable } from 'rxjs';
import { baseQuery } from './base-query';

import { QueryClient } from './query-client';
import { NgQueryObserverResult } from './types';

@Injectable({ providedIn: 'root' })
class Query {
  private instance = inject(QueryClient);

  use<
    TQueryFnData,
    TError = unknown,
    TData = TQueryFnData,
    TQueryData = TQueryFnData
  >(
    queryKey: QueryKey,
    queryFn: (
      context: QueryFunctionContext<QueryKey>
    ) => Observable<TQueryFnData>,
    options?: Omit<
      QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, QueryKey>,
      'queryKey' | 'queryFn'
    >
  ): Observable<NgQueryObserverResult<TData, TError>> & {
    instance: QueryObserver<TQueryFnData, TError, TData, QueryKey>;
  } {
    return baseQuery(this.instance, queryKey, queryFn, QueryObserver, options);
  }
}

export const QueryProvider = new InjectionToken<Query['use']>('QueryProvider', {
  providedIn: 'root',
  factory() {
    const query = new Query();
    return query.use.bind(query);
  },
});
