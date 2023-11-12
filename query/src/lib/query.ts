import {
  assertInInjectionContext,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { injectQueryClient } from './query-client';

import {
  DefaultError,
  DefinedQueryObserverResult,
  QueryKey,
  QueryObserver,
  QueryObserverResult,
} from '@tanstack/query-core';
import { createBaseQuery, CreateBaseQueryOptions } from './base-query';
import { Result } from './types';
import {
  DefinedInitialDataOptions,
  UndefinedInitialDataOptions,
} from './query-options';

@Injectable({ providedIn: 'root' })
class Query {
  #instance = injectQueryClient();
  #injector = inject(Injector);

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
  ): Result<QueryObserverResult<TData, TError>>;

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
  ): Result<DefinedQueryObserverResult<TData, TError>>;

  use<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: CreateBaseQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >
  ) {
    return createBaseQuery({
      client: this.#instance,
      injector: options.injector ?? this.#injector,
      Observer: QueryObserver,
      options,
    });
  }
}

const UseQuery = new InjectionToken<Query['use']>('UseQuery', {
  providedIn: 'root',
  factory() {
    const query = new Query();

    return query.use.bind(query);
  },
});

export function injectQuery(options?: { injector?: Injector }) {
  if (options?.injector) {
    return runInInjectionContext(options.injector, () => {
      return inject(UseQuery);
    });
  }

  assertInInjectionContext(injectQuery);

  return inject(UseQuery);
}
