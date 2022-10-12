import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  QueryKey,
  QueryFunctionContext,
  InfiniteQueryObserverOptions,
  QueryObserver,
  InfiniteQueryObserverResult,
  InfiniteQueryObserver,
} from '@tanstack/query-core';
import { Observable } from 'rxjs';
import { baseQuery } from './base-query';
import { QueryClient } from './query-client';
import { NgInfiniteQueryObserverResult } from './types';

@Injectable({ providedIn: 'root' })
class InfiniteQuery {
  private instance = inject(QueryClient);
  use<TQueryFnData, TError = unknown, TData = TQueryFnData>(
    queryKey: QueryKey,
    queryFn: (
      context: QueryFunctionContext<QueryKey>
    ) => Observable<TQueryFnData>,
    options?: InfiniteQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      QueryKey
    >
  ): Observable<NgInfiniteQueryObserverResult<TData, TError>> & {
    instance: QueryObserver<TQueryFnData, TError, TData, QueryKey>;
  } {
    return baseQuery(
      this.instance,
      queryKey,
      queryFn,
      InfiniteQueryObserver as typeof QueryObserver,
      options
    );
  }
}

export const InfiniteQueryProvider = new InjectionToken<InfiniteQuery['use']>(
  'InfiniteQueryProvider',
  {
    providedIn: 'root',
    factory() {
      const query = new InfiniteQuery();
      return query.use.bind(query);
    },
  }
);
