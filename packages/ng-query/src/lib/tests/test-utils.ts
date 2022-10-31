import { QueryKey } from '@tanstack/query-core';
import { Observable, of, throwError, delay } from 'rxjs';
import { queryOptions } from '../persisted-query';
import { ObservableQueryFn } from '../types';

export function simpleFetcher(): Observable<string> {
  return of('data');
}

export function delayFetcher(time: number): ObservableQueryFn<string> {
  return () => of('data').pipe(delay(time));
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

export type Page = {
  data: { name: string; id: number }[];
  nextId: number | null;
  previousId: number | null;
};

export function infiniteFetcher(cursor: number, pageSize: number = 5) {
  return () => {
    return new Observable<Page>((observer) => {
      const data = Array(pageSize)
        .fill(0)
        .map((_, i) => {
          return {
            name: 'data ' + (i + cursor),
            id: i + cursor,
          };
        });

      const nextId = cursor < 10 ? data[data.length - 1].id + 1 : null;
      const previousId = cursor > -10 ? data[0].id - pageSize : null;

      observer.next({ data, nextId, previousId });
      observer.complete();
    });
  };
}

export function successMutator<T>(param: T): Observable<T> {
  return of(param);
}

export function errorMutator<T>(_: T): Observable<Error> {
  return throwError(() => new Error('some error'));
}

export const persistedFetcher = (queryKey: QueryKey) => {
  return queryOptions<Page>({
    queryKey,
    queryFn: infiniteFetcher(queryKey[1] as number),
  });
};
