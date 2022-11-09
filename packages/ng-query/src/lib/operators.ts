import { QueryObserverResult } from '@tanstack/query-core';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  OperatorFunction,
  pipe,
} from 'rxjs';

export function mapResultData<
  T extends QueryObserverResult,
  Data = NonNullable<T['data']>
>(mapFn: (data: Data) => Data): OperatorFunction<T, QueryObserverResult<Data>> {
  return pipe(
    map((result) => {
      return {
        ...result,
        data: result.data ? mapFn(result.data as any) : result.data,
      } as any;
    })
  );
}

export function filterError() {
  return function (
    source: Observable<QueryObserverResult<null>>
  ): Observable<QueryObserverResult<null>> {
    return source.pipe(
      filter(
        (result): result is QueryObserverResult<null> =>
          result.status === 'error' && result.data === null
      )
    );
  };
}

export function filterSuccess<T>(): OperatorFunction<
  QueryObserverResult<T>,
  QueryObserverResult & { data: NonNullable<T> }
> {
  return filter(
    (result): result is any =>
      result.status === 'success' && result.data !== null
  );
}

export function selectResult<T, R>(
  mapFn: (result: T) => R
): OperatorFunction<T, R> {
  return pipe(map(mapFn), distinctUntilChanged());
}
