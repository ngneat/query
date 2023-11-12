import { QueryObserverResult, QueryObserver } from '@tanstack/query-core';
import { Observable } from 'rxjs';
import { Signal } from '@angular/core';

export type ObservableQueryResult<Data, Error = any> = Observable<
  QueryObserverResult<Data, Error>
>;

export type SignalQueryResult<Data, Error = any> = Signal<
  QueryObserverResult<Data, Error>
>;

export type Result<T> = {
  result$: Observable<T>;
  result: Signal<T>;
  updateOptions: QueryObserver['setOptions'];
};
