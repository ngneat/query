import { Injector, runInInjectionContext } from '@angular/core';
import type {
  DataTag,
  DefaultError,
  InfiniteQueryObserverOptions,
  QueryClient,
  QueryFunctionContext,
  QueryKey,
  QueryObserverOptions,
} from '@tanstack/query-core';
import { isObservable } from 'rxjs';
import { CreateBaseQueryOptions } from './base-query';
import { CreateInfiniteQueryOptions } from './infinite-query';
import { toPromise } from './utils';

export type UndefinedInitialDataOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = CreateBaseQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryFnData,
  TQueryKey
> & {
  initialData?: undefined;
};

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export type DefinedInitialDataOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = CreateBaseQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryFnData,
  TQueryKey
> & {
  initialData:
    | NonUndefinedGuard<TQueryFnData>
    | (() => NonUndefinedGuard<TQueryFnData>);
};

export function queryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
): UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> & {
  queryKey: DataTag<TQueryKey, TData>;
};

export function queryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
): DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> & {
  queryKey: DataTag<TQueryKey, TData>;
};

export function queryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
>(
  options: CreateInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey,
    TPageParam
  >,
): CreateInfiniteQueryOptions<
  TQueryFnData,
  TError,
  TQueryFnData,
  TQueryFnData,
  TQueryKey,
  TPageParam
> & {
  queryKey: DataTag<TQueryKey, TData>;
};
export function queryOptions(options: unknown) {
  return options;
}

export function queryObserverOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
>(
  options: CreateInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey,
    TPageParam
  >,
): InfiniteQueryObserverOptions<
  TQueryFnData,
  TError,
  TQueryFnData,
  TQueryFnData,
  TQueryKey,
  TPageParam
>;
export function queryObserverOptions<
  TQueryFnData = unknown,
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
): QueryObserverOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryFnData,
  TQueryKey,
  TPageParam
>;
export function queryObserverOptions(options: unknown) {
  return options;
}

export function normalizeOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey,
  TPageParam = never,
>(
  client: QueryClient,
  options: QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey,
    TPageParam
  >,
  injector: Injector,
) {
  const defaultedOptions = client.defaultQueryOptions(
    options as unknown as QueryObserverOptions,
  );
  defaultedOptions._optimisticResults = 'optimistic';

  const originalQueryFn = defaultedOptions.queryFn;

  if (originalQueryFn) {
    defaultedOptions.queryFn = function (ctx: QueryFunctionContext) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this;

      return runInInjectionContext(injector, () => {
        const value = originalQueryFn.call(_this, ctx);

        if (isObservable(value)) {
          return toPromise({ source: value, signal: ctx.signal });
        }

        return value;
      });
    };
  }

  return defaultedOptions;
}
