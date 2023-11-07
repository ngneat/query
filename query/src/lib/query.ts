import {
  assertInInjectionContext,
  inject,
  Injectable,
  InjectionToken,
} from '@angular/core';
import { injectQueryClient } from './query-client';

import {
  DefaultError,
  DefinedQueryObserverResult,
  QueryKey,
  QueryObserver,
} from '@tanstack/query-core';
import {
  createBaseQuery,
  CreateBaseQueryOptions,
  CreateBaseQueryResult,
} from './base-query';
import { Result } from './types';

export type CreateQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = CreateBaseQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryFnData,
  TQueryKey
>;

export type CreateQueryResult<
  TData = unknown,
  TError = DefaultError
> = CreateBaseQueryResult<TData, TError>;

export type DefinedCreateBaseQueryResult<
  TData = unknown,
  TError = DefaultError
> = Result<DefinedQueryObserverResult<TData, TError>>;

export type DefinedCreateQueryResult<
  TData = unknown,
  TError = DefaultError
> = Result<DefinedCreateBaseQueryResult<TData, TError>>;

export type UndefinedInitialDataOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
  initialData?: undefined;
};

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export type DefinedInitialDataOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
  initialData:
    | NonUndefinedGuard<TQueryFnData>
    | (() => NonUndefinedGuard<TQueryFnData>);
};

@Injectable({ providedIn: 'root' })
class Query {
  private instance = injectQueryClient();

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
  ): CreateQueryResult<TData, TError>;

  use<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(
    options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
  ): DefinedCreateQueryResult<TData, TError>;

  use<
    TQueryFnData,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
  >(options: CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
    return createBaseQuery({
      client: this.instance,
      Observer: QueryObserver,
      options,
    });
  }
}

const UseQuery = new InjectionToken<Query['use']>('UseQuery', {
  providedIn: 'root',
  factory() {
    const query = new Query();

    return query.use.bind(query);
  },
});

export function injectQuery() {
  assertInInjectionContext(injectQuery);

  return inject(UseQuery);
}
