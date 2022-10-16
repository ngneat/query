import { QueryFunctionContext, QueryKey } from '@tanstack/query-core';
import { Observable } from 'rxjs';

export type ObservableQueryFn<
  TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = (context: QueryFunctionContext<TQueryKey>) => Observable<TQueryFnData>;
