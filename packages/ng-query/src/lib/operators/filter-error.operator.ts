import { filter, Observable } from 'rxjs';
import { NgQueryObserverResult } from '../types';

export function filterError() {
  return function(
    source: Observable<NgQueryObserverResult<null>>
  ): Observable<NgQueryObserverResult<null>> {
    return source.pipe(
      filter(
        (result): result is NgQueryObserverResult<null> =>
          result.status === 'error' && result.data === null
      )
    );
  };
}
