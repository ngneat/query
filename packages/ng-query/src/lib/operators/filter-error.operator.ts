import { QueryObserverResult } from '@tanstack/query-core';
import { filter, Observable } from 'rxjs';

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
