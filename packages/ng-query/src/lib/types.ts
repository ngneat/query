import {
  InfiniteQueryObserverResult,
  QueryFunctionContext,
  QueryKey,
  QueryObserverResult,
} from '@tanstack/query-core';
import { Observable } from 'rxjs';

export type NgQueryObserverResult<
  TData = unknown,
  TError = unknown
> = QueryObserverResult<TData, TError>;

export type NgInfiniteQueryObserverResult<
  TData = unknown,
  TError = unknown
> = InfiniteQueryObserverResult<TData, TError>;

export type ObservableQueryFn<
  TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = (context: QueryFunctionContext<TQueryKey>) => Observable<TQueryFnData>;
