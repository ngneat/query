import {
  assertInInjectionContext,
  inject,
  InjectionToken,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  DefaultError,
  DefinedQueryObserverResult,
  QueryKey,
  QueryObserver,
  QueryObserverResult,
} from '@tanstack/query-core';

import { createBaseQuery, CreateBaseQueryOptions } from './base-query';
import { injectQueryClient } from './query-client';
import {
  DefinedInitialDataOptions,
  UndefinedInitialDataOptions,
} from './query-options';
import { Result } from './types';

/** @internal */
export const QueryToken = new InjectionToken<Query>('Query', {
  providedIn: 'root',
  factory() {
    return new Query();
  },
});

export interface QueryObject {
  use:
    | (<
        TQueryFnData = unknown,
        TError = DefaultError,
        TData = TQueryFnData,
        TQueryKey extends QueryKey = QueryKey,
      >(
        options: UndefinedInitialDataOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryKey
        >,
      ) => Result<QueryObserverResult<TData, TError>>)
    | (<
        TQueryFnData = unknown,
        TError = DefaultError,
        TData = TQueryFnData,
        TQueryKey extends QueryKey = QueryKey,
      >(
        options: DefinedInitialDataOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryKey
        >,
      ) => Result<DefinedQueryObserverResult<TData, TError>>)
    | (<
        TQueryFnData,
        TError = DefaultError,
        TData = TQueryFnData,
        TQueryKey extends QueryKey = QueryKey,
      >(
        options: CreateBaseQueryOptions<
          TQueryFnData,
          TError,
          TData,
          TQueryFnData,
          TQueryKey
        >,
      ) => any);
}

/** @internal
 * only exported for @test
 */
export class Query implements QueryObject {
  readonly #instance = injectQueryClient();
  readonly #injector = inject(Injector);

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: UndefinedInitialDataOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey
    >,
  ): Result<QueryObserverResult<TData, TError>>;

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  ): Result<DefinedQueryObserverResult<TData, TError>>;

  use<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: CreateBaseQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >,
  ) {
    return createBaseQuery({
      client: this.#instance,
      injector: options.injector ?? this.#injector,
      Observer: QueryObserver,
      options,
    });
  }
}

function queryUseFnFromToken() {
  const query = inject(QueryToken);
  return query.use.bind(query);
}

/**
 *
 * Optionally pass an injector that will be used than the current one.
 * Can be useful if you want to use it in ngOnInit hook for example.
 *
 * @example
 *
 * injector = inject(Injector);
 *
 * ngOnInit() {
 *  const todos = getTodos({ injector: this.injector }).result;
 * }
 *
 */
export function injectQuery(options?: { injector?: Injector }) {
  if (options?.injector) {
    return runInInjectionContext(options.injector, () => queryUseFnFromToken());
  }

  assertInInjectionContext(injectQuery);

  return queryUseFnFromToken();
}
