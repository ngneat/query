import {
  assertInInjectionContext,
  inject,
  Injectable,
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
    return runInInjectionContext(options.injector, () => {
      const query = inject(Query);

      return query.use.bind(query);
    });
  }

  assertInInjectionContext(injectQuery);

  const query = inject(Query);

  return query.use.bind(query);
}
