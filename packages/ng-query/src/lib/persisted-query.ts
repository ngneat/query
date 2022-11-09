import { inject, Injectable, InjectionToken } from '@angular/core';
import { QueryKey, QueryOptions } from '@tanstack/query-core';
import {
  NgQueryObserverOptions,
  NgQueryObserverReturnType,
  UseQuery,
} from './query';
import { QueryClientService } from './query-client';
import { ObservableQueryFn } from './types';
import { fromQueryFn } from './utils';

export function queryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: NgQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >
) {
  return options;
}

@Injectable({ providedIn: 'root' })
export class PersistedQueryService {
  private useQuery = inject(UseQuery);
  private client = inject(QueryClientService);

  use<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    Params = Record<string, unknown>
  >(
    queryObserverOptionsFn: (
      key: TQueryKey,
      params?: Params
    ) => NgQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >
  ) {
    let observer: NgQueryObserverReturnType<
      TQueryFnData,
      TError,
      TData,
      TQueryKey
    >;

    return (key: TQueryKey, params?: Params) => {
      const mergedOptions = {
        ...queryObserverOptionsFn(key, params),
        keepPreviousData: true,
      } as unknown as QueryOptions<TQueryFnData, TError, TData, TQueryKey>;

      if (!observer) {
        observer = this.useQuery(mergedOptions as any);
      } else {
        const originalQueryFn =
          mergedOptions.queryFn as unknown as ObservableQueryFn<TQueryFnData>;

        mergedOptions.queryFn = fromQueryFn(
          originalQueryFn,
          this.client,
          mergedOptions.queryKey as any
        );

        const options = this.client.defaultQueryOptions(mergedOptions);
        observer.setOptions(options as any);
      }

      return observer;
    };
  }
}

export type UsePersistedQuery = PersistedQueryService['use'];

export const UsePersistedQuery = new InjectionToken<UsePersistedQuery>(
  'UsePersistedQuery',
  {
    providedIn: 'root',
    factory() {
      const query = new PersistedQueryService();
      return query.use.bind(query);
    },
  }
);
