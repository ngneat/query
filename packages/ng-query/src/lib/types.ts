import {
  DataTag,
  DefaultError,
  InfiniteData, InfiniteQueryObserver,
  InfiniteQueryObserverResult,
  QueryFunctionContext,
  QueryKey, QueryObserverOptions, QueryObserverResult
} from '@tanstack/query-core';
import {Observable, Unsubscribable} from 'rxjs';
import {
  DefinedQueryObserverResult,
  InfiniteQueryObserverOptions,
  QueryObserver
} from '@tanstack/query-core';

type NonUndefinedGuard<T> = T extends undefined ? never : T

export type ObservableQueryFn<
  TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never
> = (context: QueryFunctionContext<TQueryKey, TPageParam>) => Observable<TQueryFnData>;

// create query options types
export type NgBaseQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Omit<QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>, 'queryFn'>
  & { queryFn?: ObservableQueryFn<TQueryFnData, TQueryKey>; };

export type NgUndefinedInitialDataQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<NgBaseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>, 'initialData'>
  & { initialData?: undefined; }

export type NgDefinedInitialDataQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<NgBaseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'initialData'> & {
  initialData:
    | NonUndefinedGuard<TQueryFnData>
    | (() => NonUndefinedGuard<TQueryFnData>)
}

// create query return types
export type NgQueryObserverUndefinedReturnType<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Unsubscribable
  & Omit<QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>, 'subscribe'>
  & { result$: Observable<QueryObserverResult<TData, TError>>; };

export type NgQueryObserverDefinedReturnType<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Omit<QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>, 'subscribe'>
  & { result$: Observable<DefinedQueryObserverResult<TData, TError>>; };

// create infinite query options
export type NgInfiniteQueryObserverOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
> = Omit<InfiniteQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey, TPageParam>, 'queryFn'>
  & { queryFn?: ObservableQueryFn<TQueryFnData, TQueryKey, TPageParam>; };

// create infinite query return types
export type NgInfiniteQueryObserverReturnType<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
> = Unsubscribable & {
  result$: Observable<
    InfiniteQueryObserverResult<InfiniteData<TQueryData, TPageParam>, TError>
  >;
} & Omit<
  InfiniteQueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  'subscribe'
>;
