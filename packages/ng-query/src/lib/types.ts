import { QueryFunctionContext, QueryKey } from '@tanstack/query-core';
import { Observable } from 'rxjs';

export type ObservableQueryFn<
  TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never
> = (context: QueryFunctionContext<TQueryKey, TPageParam>) => Observable<TQueryFnData>;
