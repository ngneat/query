import {
  QueryObserverResult,
  QueryObserverSuccessResult,
  QueryObserverLoadingErrorResult,
} from '@tanstack/query-core';
import {
  distinctUntilChanged,
  filter,
  map,
  OperatorFunction,
  pipe,
} from 'rxjs';

export function mapResultData<T extends QueryObserverResult, R>(
  mapFn: (data: NonNullable<T['data']>) => R
): OperatorFunction<T, QueryObserverResult<R>> {
  return pipe(
    map((result) => {
      return {
        ...result,
        data: result.data ? mapFn(result.data as any) : result.data,
      } as any;
    })
  );
}

export function filterError<T, E>(): OperatorFunction<
  QueryObserverResult<T>,
  QueryObserverLoadingErrorResult<T, E>
> {
  return filter(
    (result): result is QueryObserverLoadingErrorResult<T, E> =>
      result.status === 'error'
  );
}

export function filterSuccess<T>(): OperatorFunction<
  QueryObserverResult<T>,
  QueryObserverSuccessResult<T>
> {
  return filter(
    (result): result is QueryObserverSuccessResult<T> =>
      result.status === 'success'
  );
}

export function selectResult<T, R>(
  mapFn: (result: T) => R
): OperatorFunction<T, R> {
  return pipe(map(mapFn), distinctUntilChanged());
}
