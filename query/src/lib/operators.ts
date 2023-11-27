import {
  QueryObserverBaseResult,
  QueryObserverLoadingErrorResult,
  QueryObserverResult,
  QueryObserverSuccessResult,
} from '@tanstack/query-core';
import { filter, map, OperatorFunction, startWith, takeWhile, tap } from 'rxjs';

export function mapResultData<T extends QueryObserverBaseResult, R>(
  mapFn: (data: NonNullable<T['data']>) => R,
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

export function filterSuccessResult<T>(): OperatorFunction<
  QueryObserverBaseResult<T>,
  QueryObserverSuccessResult<T>
> {
  return filter(
    (result): result is QueryObserverSuccessResult<T> => result.isSuccess,
  );
}

export function filterErrorResult<T, E>(): OperatorFunction<
  QueryObserverBaseResult<T, E>,
  QueryObserverLoadingErrorResult<T, E>
> {
  return filter(
    (result): result is QueryObserverLoadingErrorResult<T, E> =>
      result.status === 'error',
  );
}

export function tapSuccessResult<T extends QueryObserverBaseResult>(
  cb: (data: NonNullable<T['data']>) => void,
) {
  return tap<T>((result) => {
    if (result.isSuccess) {
      cb(result.data as NonNullable<T['data']>);
    }
  });
}

export function tapErrorResult<T extends QueryObserverBaseResult>(
  cb: (error: NonNullable<T['error']>) => void,
) {
  return tap<T>((result) => {
    if (result.isError) {
      cb(result.error as NonNullable<T['error']>);
    }
  });
}

/**
 * An operator that takes values emitted by the source observable
 * until the `isFetching` property on the result is false.
 * It is intended to be used in scenarios where an observable stream should be listened to
 * until the result has finished fetching (e.g success or error).
 */
export function takeUntilResultFinalize<T extends QueryObserverBaseResult>() {
  return takeWhile((res: T) => res.isFetching, true);
}

/**
 * An operator that takes values emitted by the source observable
 * until the `isSuccess` property on the result is true.
 * It is intended to be used in scenarios where an observable stream should be listened to
 * until a successful result is emitted.
 */
export function takeUntilResultSuccess<T extends QueryObserverBaseResult>() {
  return takeWhile((res: T) => !res.isSuccess, true);
}

/**
 * An operator that takes values emitted by the source observable
 * until the `isError` property on the result is true.
 * It is intended to be used in scenarios where an observable stream should be listened to
 * until an error result is emitted.
 */
export function takeUntilResultError<T extends QueryObserverBaseResult>() {
  return takeWhile((res: T) => !res.isError, true);
}

export function startWithQueryResult<T>(): OperatorFunction<
  QueryObserverBaseResult<T>,
  QueryObserverBaseResult<T>
> {
  return startWith({
    isError: false,
    isLoading: true,
    isPending: true,
    isFetching: true,
    isSuccess: false,
    fetchStatus: 'fetching',
    status: 'pending',
  } as QueryObserverBaseResult<T>);
}

type DataTypes<
  T extends
    | QueryObserverBaseResult[]
    | Record<string, QueryObserverBaseResult<any>>,
> = {
  [P in keyof T]: T[P] extends QueryObserverBaseResult<infer R> ? R : never;
};

type UnifiedTypes<T> = T extends Array<QueryObserverBaseResult<any>>
  ? DataTypes<T>
  : T extends Record<string, QueryObserverBaseResult<any>>
    ? DataTypes<T>
    : never;

/**
 *
 *  This operator is used to merge multiple queries into one.
 *  It will return a new base query result that will merge the results of all the queries.
 *
 * @example
 *
 * const query = combineLatest({
 *   todos: todos.result$,
 *   posts: posts.result$,
 * }).pipe(
 *   intersectResults$(({ todos, posts }) => {
 *     return { ... }
 *   })
 * )
 * @example
 *
 * const query = combineLatest([todos.result$, posts.result$]).pipe(
 *   intersectResults$(([todos, posts]) => {
 *     return { ... }
 *   })
 * )
 */
export function intersectResults$<
  T extends
    | Array<QueryObserverBaseResult<any>>
    | Record<string, QueryObserverBaseResult<any>>,
  R,
>(
  mapFn: (values: UnifiedTypes<T>) => R,
): OperatorFunction<T, QueryObserverResult<R> & { all: T }> {
  return map((values) => {
    const isArray = Array.isArray(values);
    const toArray = isArray ? values : Object.values(values);

    const mappedResult = {
      all: values,
      isSuccess: toArray.every((v) => v.isSuccess),
      isPending: toArray.some((v) => v.isPending),
      isLoading: toArray.some((v) => v.isLoading),
      isError: toArray.some((v) => v.isError),
      isFetching: toArray.some((v) => v.isFetching),
      error: toArray.find((v) => v.isError)?.error,
      data: undefined,
    } as unknown as QueryObserverResult<R> & { all: T };

    if (mappedResult.isSuccess) {
      if (isArray) {
        mappedResult.data = mapFn(
          toArray.map((r) => r.data) as UnifiedTypes<T>,
        );
      } else {
        const data = Object.entries(values).reduce((acc, [key, value]) => {
          acc[key as keyof UnifiedTypes<T>] = value.data;

          return acc;
        }, {} as UnifiedTypes<T>);

        mappedResult.data = mapFn(data);
      }
    }

    return mappedResult;
  });
}
