import { distinctUntilChanged, map, OperatorFunction, pipe } from 'rxjs';

// rethink about the name
export function selectResult<T, R>(
  mapFn: (result: T) => R
): OperatorFunction<T, R> {
  return pipe(map(mapFn), distinctUntilChanged());
}
