import type { DefaultError, QueryKey } from '@tanstack/query-core';
import type {
  DefinedInitialDataOptions,
  UndefinedInitialDataOptions,
} from './query';

export function queryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
): UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>;

export function queryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
): DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>;

export function queryOptions(options: unknown) {
  return options;
}
