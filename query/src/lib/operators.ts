import {
  QueryObserverBaseResult,
  QueryObserverLoadingErrorResult,
  QueryObserverResult,
  QueryObserverSuccessResult,
} from '@tanstack/query-core';
import { filter, map, OperatorFunction, startWith, tap } from 'rxjs';

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

export function filterSuccess<T>(): OperatorFunction<
  QueryObserverResult<T>,
  QueryObserverSuccessResult<T>
> {
  return filter(
    (result): result is QueryObserverSuccessResult<T> => result.isSuccess
  );
}

export function filterError<T, E>(): OperatorFunction<
  QueryObserverResult<T, E>,
  QueryObserverLoadingErrorResult<T, E>
> {
  return filter(
    (result): result is QueryObserverLoadingErrorResult<T, E> =>
      result.status === 'error'
  );
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
    | Record<string, QueryObserverBaseResult<any>>
> = {
  [P in keyof T]: T[P] extends QueryObserverBaseResult<infer R> ? R : never;
};

type UnifiedTypes<T> = T extends Array<QueryObserverBaseResult<any>>
  ? DataTypes<T>
  : T extends Record<string, QueryObserverResult<any>>
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
 *   intersectResults(({ todos, posts }) => {
 *     return { ... }
 *   })
 * )
 * @example
 *
 * const query = combineLatest([todos.result$, posts.result$]).pipe(
 *   intersectResults(([todos, posts]) => {
 *     return { ... }
 *   })
 * )
 */
export function intersectResults<
  T extends
    | Array<QueryObserverResult<any>>
    | Record<string, QueryObserverResult<any>>,
  R
>(
  mapFn: (values: UnifiedTypes<T>) => R
): OperatorFunction<T, QueryObserverResult<R> & { all: T }> {
  return map((values) => {
    const toArray = Array.isArray(values) ? values : Object.values(values);

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
      if (Array.isArray(values)) {
        mappedResult.data = mapFn(
          toArray.map((r) => r.data) as UnifiedTypes<T>
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
