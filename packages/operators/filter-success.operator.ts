import { Observable } from 'rxjs';
import { NgQueryObserverResult } from '../ng-query/src/lib/types';

export function filterSuccess() {
  return function <T>(
    source: Observable<NgQueryObserverResult<T>>
  ): Observable<NgQueryObserverResult<T>> {
    return new Observable((subscriber) => {
      source.subscribe({
        next(value) {
          if (value?.status === 'success') {
            subscriber.next(value);
          }
        },
        error(error) {
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });
    });
  };
}
