import { QueryObserverResult, QueryObserver } from '@tanstack/query-core';
import { Observable } from 'rxjs';
import { Signal } from '@angular/core';

export type ObservableQueryResult<T> = Observable<QueryObserverResult<T>>;

export type Result<T> = {
  result$: Observable<T>;
  toSignal(): Signal<T>;
  setOptions: QueryObserver['setOptions'];
};