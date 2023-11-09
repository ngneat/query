import {
  QueryObserverResult,
  QueryObserverSuccessResult,
  QueryObserverLoadingErrorResult,
} from '@tanstack/query-core';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  OperatorFunction,
  pipe,
  startWith,
  tap,
} from 'rxjs';

export function mapResultData<T extends QueryObserverResult, R>(
  mapFn: (data: NonNullable<T['data']>) => R
): OperatorFunction<T, QueryObserverResult<R>> {
  return map((result) => {
    return {
      ...result,
      data: result.isSuccess
        ? mapFn(result.data as NonNullable<T['data']>)
        : result.data,
    } as QueryObserverResult<R>;
  });
}

type ReturnTypes<T extends QueryObserverResult[]> = {
  [P in keyof T]: T[P] extends QueryObserverResult<infer R> ? R : never;
};

export function mapResultsData<T extends QueryObserverResult[], R>(
  mapFn: (data: ReturnTypes<T>) => R
): OperatorFunction<T, QueryObserverResult<R>> {
  return map((result) => {
    const mappedResult = {
      isLoading: result.some((r) => r.isLoading),
      isSuccess: result.every((r) => r.isSuccess),
      isFetching: result.some((r) => r.isFetching),
      isError: result.some((r) => r.isError),
      error: result.find((r) => r.isError)?.error,
      data: undefined,
    } as QueryObserverResult<R>;

    if (mappedResult.isSuccess) {
      mappedResult.data = mapFn(result.map((r) => r.data) as ReturnTypes<T>);
    }

    return mappedResult;
  });
}

export type ObservableQueryResult<T> = Observable<QueryObserverResult<T>>;

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
    (result): result is QueryObserverSuccessResult<T> => result.isSuccess
  );
}

export function selectResult<T, R>(
  mapFn: (result: T) => R
): OperatorFunction<T, R> {
  return pipe(map(mapFn), distinctUntilChanged());
}

export function tapSuccess<T extends QueryObserverResult>(
  cb: (data: NonNullable<T['data']>) => void
) {
  return tap<T>((result) => {
    if (result.isSuccess) {
      cb(result.data as NonNullable<T['data']>);
    }
  });
}

export function tapError<T extends QueryObserverResult>(
  cb: (error: NonNullable<T['error']>) => void
) {
  return tap<T>((result) => {
    if (result.isError) {
      cb(result.error as NonNullable<T['error']>);
    }
  });
}

export function startWithQueryResult<T>(): OperatorFunction<T, T> {
  return startWith({
    error: null,
    isError: false,
    isLoading: true,
    isSuccess: false,
  } as T);
}

export function isPendingState<T extends QueryObserverResult>(res: T) {
  return res.isLoading || res.isFetching;
}
