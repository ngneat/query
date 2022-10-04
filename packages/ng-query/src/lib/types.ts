import { QueryObserverResult } from '@tanstack/query-core';

export type NgQueryObserverResult<T> = QueryObserverResult<T> & {
  queryKey: unknown[];
};
