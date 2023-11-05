import { notifyManager, type QueryFilters } from '@tanstack/query-core';
import { injectQueryClient } from './query-client';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { distinctUntilChanged, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class IsFetching {
  private queryClient = injectQueryClient();

  use(filters?: QueryFilters) {
    const result$ = new Observable<number>((observer) => {
      observer.next(this.queryClient.isFetching(filters));
      const disposeSubscription = this.queryClient.getQueryCache().subscribe(
        notifyManager.batchCalls(() => {
          observer.next(this.queryClient.isFetching(filters));
        })
      );

      return () => disposeSubscription();
    }).pipe(distinctUntilChanged());

    return {
      result$,
      toSignal: () => toSignal(result$),
    };
  }
}

const UseIsFetching = new InjectionToken<IsFetching['use']>('UseIsFetching', {
  providedIn: 'root',
  factory() {
    const isFetching = new IsFetching();
    return isFetching.use.bind(isFetching);
  },
});

export function injectIsFetching() {
  return inject(UseIsFetching);
}
