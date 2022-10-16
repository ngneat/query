import { QueryObserverResult } from '@tanstack/query-core';
import { filter, Observable } from 'rxjs';

export function filterSuccess() {
  return function <T>(
    source: Observable<QueryObserverResult<T>>
  ): Observable<QueryObserverResult<T>> {
    return source.pipe(
      filter(
        (result): result is QueryObserverResult<Exclude<T, null>> =>
          result.status === 'success' && result.data !== null
      )
    );
  };
}
