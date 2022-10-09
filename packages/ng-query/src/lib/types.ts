import { QueryObserverResult } from '@tanstack/query-core';

export type NgQueryObserverResult<
  TData = unknown,
  TError = unknown
> = QueryObserverResult<TData, TError>;
