import { Observable, of, throwError } from 'rxjs';
import { ObservableQueryFn } from '../types';

export function simpleFetcher(): Observable<string> {
  return of('data');
}

export function fetcher<T>(data: T): ObservableQueryFn<T> {
  return () => of(data);
}

export function rejectFetcher<T = unknown>(): ObservableQueryFn<T> {
  return () => throwError(() => new Error('some error'));
}

export function flushPromises(timeout = 0): Promise<unknown> {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}
