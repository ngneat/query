import {
  InfiniteQueryObserverResult,
  QueryObserverResult,
} from '@tanstack/query-core';

export type NgQueryObserverResult<
  TData = unknown,
  TError = unknown
> = QueryObserverResult<TData, TError>;

export type NgInfiniteQueryObserverResult<
  TData = unknown,
  TError = unknown
> = InfiniteQueryObserverResult<TData, TError>;
