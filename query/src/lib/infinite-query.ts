import {
  assertInInjectionContext,
  inject,
  InjectionToken,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { injectQueryClient } from './query-client';
import {
  DefaultError,
  InfiniteData,
  InfiniteQueryObserver,
  InfiniteQueryObserverOptions,
  InfiniteQueryObserverResult,
  QueryKey,
  QueryObserver,
  WithRequired,
} from '@tanstack/query-core';
import {
  createBaseQuery,
  Options,
  QueryFunctionWithObservable,
} from './base-query';
import { Result } from './types';

/** @internal */
export const InfiniteQueryToken = new InjectionToken<InfiniteQuery>(
  'InfiniteQuery',
  {
    providedIn: 'root',
    factory() {
      return new InfiniteQuery();
    },
  },
);

interface _CreateInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> extends WithRequired<
      InfiniteQueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryKey,
        TPageParam
      >,
      'queryKey'
    >,
    Options {}

export type CreateInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
> = Omit<
  _CreateInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
  'queryFn'
> & {
  queryFn: QueryFunctionWithObservable<TQueryFnData, TQueryKey, TPageParam>;
};

export interface InfiniteQueryObject {
  use: <
    TQueryFnData,
    TError = DefaultError,
    TData = InfiniteData<TQueryFnData>,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown,
  >(
    options: CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
  ) => Result<InfiniteQueryObserverResult<TData, TError>>;
}

/** @internal
 * only exported for @test
 */
class InfiniteQuery implements InfiniteQueryObject {
  #instance = injectQueryClient();
  #injector = inject(Injector);

  use<
    TQueryFnData,
    TError = DefaultError,
    TData = InfiniteData<TQueryFnData>,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown,
  >(
    options: CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
  ): Result<InfiniteQueryObserverResult<TData, TError>> {
    return createBaseQuery({
      client: this.#instance,
      injector: options.injector ?? this.#injector,
      Observer: InfiniteQueryObserver as typeof QueryObserver,
      options: options as any,
    });
  }
}

function infiniteQueryUseFnFromToken() {
  const infiniteQuery = inject(InfiniteQueryToken);
  return infiniteQuery.use.bind(infiniteQuery);
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
 *  const infiniteQuery = injectInfiniteQuery({ injector: this.injector });
 * }
 *
 */
export function injectInfiniteQuery(options?: { injector?: Injector }) {
  if (options?.injector) {
    return runInInjectionContext(options.injector, () =>
      infiniteQueryUseFnFromToken(),
    );
  }

  assertInInjectionContext(injectInfiniteQuery);

  return infiniteQueryUseFnFromToken();
}
