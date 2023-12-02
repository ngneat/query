import { QueryObserverResult, QueryKey } from '@tanstack/query-core';
import { Observable } from 'rxjs';
import { Signal } from '@angular/core';
import {
  DefinedInitialDataOptions,
  UndefinedInitialDataOptions,
} from './query-options';

export type ObservableQueryResult<Data, Error = any> = Observable<
  QueryObserverResult<Data, Error>
>;

export type SignalQueryResult<Data, Error = any> = Signal<
  QueryObserverResult<Data, Error>
>;

export type Result<T> = {
  result$: Observable<T>;
  result: Signal<T>;
  updateOptions<TQueryFnData, TError, TData, TQueryKey extends QueryKey>(
    options:
      | UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>
      | DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>,
  ): void;
};
