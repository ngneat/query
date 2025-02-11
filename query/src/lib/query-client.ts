import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  PLATFORM_ID,
  Provider,
} from '@angular/core';
import {
  QueryClient as _QueryClient,
  DefaultError,
  FetchInfiniteQueryOptions,
  FetchQueryOptions,
  InfiniteData,
  InfiniteQueryObserverOptions,
  QueryKey,
  QueryObserverOptions,
} from '@tanstack/query-core';
import { CreateBaseQueryOptions } from './base-query';
import { CreateInfiniteQueryOptions } from './infinite-query';
import { QUERY_CLIENT_OPTIONS } from './query-client-options';
import { normalizeOptions } from './query-options';

const QueryClientToken = new InjectionToken<QueryClient>('QueryClient', {
  providedIn: 'root',
  factory() {
    return new QueryClient(inject(QUERY_CLIENT_OPTIONS));
  },
});

@Injectable({
  providedIn: 'root',
})
class QueryClientMount implements OnDestroy {
  instance = inject(QueryClientToken);

  constructor() {
    this.instance.mount();
  }

  ngOnDestroy() {
    this.instance.unmount();
  }
}

const QueryClientService = new InjectionToken<QueryClient>(
  'QueryClientService',
  {
    providedIn: 'root',
    factory() {
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        inject(QueryClientMount);
      }

      return inject(QueryClientToken);
    },
  },
);

/** @public */
export function provideQueryClient(queryClientOrFactory: _QueryClient | (() => _QueryClient)): Provider {
  return {
    provide: QueryClientToken,
    useFactory:
      typeof queryClientOrFactory === 'function'
        ? queryClientOrFactory
        : () => queryClientOrFactory,
  };
}

/** @public */
export function injectQueryClient() {
  return inject(QueryClientService);
}

/** should be exported for @test */
export class QueryClient extends _QueryClient {
  #injector = inject(Injector);

  /**
   *
   * Asynchronous function that can be used to get an existing query's cached data.
   * If the query does not exist, queryClient.fetchQuery will be called and its results
   * returned.
   *
   * @example
   *
   * queryClient = injectQueryClient();
   *
   * const data = await queryClient.ensureQueryData({ queryKey, queryFn })
   *
   */
  override ensureQueryData<
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
  ): Promise<TData>;
  override ensureQueryData<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey, never>,
  ): Promise<TData>;
  override ensureQueryData<
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
  ): Promise<TData> {
    const defaultedOptions = normalizeOptions(
      this,
      options as QueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey
      >,
      this.#injector,
    ) as unknown as FetchQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      never
    >;
    return super.ensureQueryData(defaultedOptions);
  }

  /**
   *
   * Asynchronous method that can be used to fetch and cache a query.
   * It will either resolve with the data or throw with the error.
   * Use the prefetchQuery method if you just want to fetch a query without
   * needing the result.
   * If the query exists and the data is not invalidated or older than the given
   * staleTime, then the data from the cache will be returned.
   * Otherwise it will try to fetch the latest data.
   *
   * @example
   *
   * queryClient = injectQueryClient();
   *
   * const data = await queryClient.fetchQuery({ queryKey, queryFn })
   *
   */
  override fetchQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = never,
  >(
    options: CreateBaseQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      TPageParam
    >,
  ): Promise<TData>;
  override fetchQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = never,
  >(
    options: FetchQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
  ): Promise<TData>;
  override fetchQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = never,
  >(
    options: CreateBaseQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      TPageParam
    >,
  ): Promise<TData> {
    const defaultedOptions = normalizeOptions(
      this,
      options as QueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey,
        TPageParam
      >,
      this.#injector,
    ) as unknown as FetchQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >;
    return super.fetchQuery(defaultedOptions);
  }

  /**
   *
   * Asynchronous method that can be used to prefetch a query before
   * it is needed or rendered with useQuery and friends.
   * The method works the same as fetchQuery except that it will not
   * throw or return any data.
   *
   * @example
   *
   * queryClient = injectQueryClient();
   *
   * await queryClient.prefetchQuery({ queryKey, queryFn })
   *
   */
  override prefetchQuery<
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
  ): Promise<void>;
  override prefetchQuery<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  >(
    options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  ): Promise<void>;
  override prefetchQuery<
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
  ): Promise<void> {
    const defaultedOptions = normalizeOptions(
      this,
      options as QueryObserverOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryFnData,
        TQueryKey
      >,
      this.#injector,
    ) as unknown as FetchQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      never
    >;
    return super.prefetchQuery(defaultedOptions);
  }

  /**
   *
   * Similar to fetchQuery but can be used to fetch and cache an infinite query
   *
   * @example
   *
   * queryClient = injectQueryClient();
   *
   * const data = await queryClient.fetchInfiniteQuery({ queryKey, queryFn, initialPageParam, getPreviousPageParam, getNextPageParam }) })
   *
   */
  override fetchInfiniteQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown,
  >(
    options: CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      TPageParam
    >,
  ): Promise<InfiniteData<TData, TPageParam>>;
  override fetchInfiniteQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown,
  >(
    options: FetchInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
  ): Promise<InfiniteData<TData, TPageParam>>;
  override fetchInfiniteQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown,
  >(
    options: CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      TPageParam
    >,
  ): Promise<InfiniteData<TData, TPageParam>> {
    const defaultedOptions = normalizeOptions(
      this,
      options as InfiniteQueryObserverOptions<
        TQueryFnData,
        TError,
        TQueryFnData,
        TQueryFnData,
        TQueryKey,
        TPageParam
      >,
      this.#injector,
    ) as unknown as FetchInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >;
    return super.fetchInfiniteQuery(defaultedOptions);
  }

  /**
   *
   * Similar to prefetchQuery but can be used to prefetch and cache an infinite query.
   *
   * @example
   *
   * queryClient = injectQueryClient();
   *
   * await queryClient.prefetchInfiniteQuery({ queryKey, queryFn, initialPageParam, getPreviousPageParam, getNextPageParam })
   *
   */
  override prefetchInfiniteQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown,
  >(
    options: CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      TPageParam
    >,
  ): Promise<void>;
  override prefetchInfiniteQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown,
  >(
    options: FetchInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >,
  ): Promise<void>;
  override prefetchInfiniteQuery<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown,
  >(
    options: CreateInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey,
      TPageParam
    >,
  ): Promise<void> {
    const defaultedOptions = normalizeOptions(
      this,
      options as InfiniteQueryObserverOptions<
        TQueryFnData,
        TError,
        TQueryFnData,
        TQueryFnData,
        TQueryKey,
        TPageParam
      >,
      this.#injector,
    ) as unknown as FetchInfiniteQueryOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >;
    return super.prefetchInfiniteQuery(defaultedOptions);
  }
}
