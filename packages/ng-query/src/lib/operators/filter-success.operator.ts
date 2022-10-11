import { filter, Observable } from 'rxjs';
import { NgQueryObserverResult } from '../types';

export function filterSuccess() {
  return function <T>(
    source: Observable<NgQueryObserverResult<T>>
  ): Observable<NgQueryObserverResult<T>> {
    return source.pipe(
      filter(
        (result): result is NgQueryObserverResult<Exclude<T, null>> =>
          result.status === 'success' && result.data !== null
      )
    );
  };
}
