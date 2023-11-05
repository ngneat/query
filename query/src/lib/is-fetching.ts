import { QueryFilters, notifyManager } from '@tanstack/query-core';
import { injectQueryClient } from './query-client';
import { DestroyRef, inject, Injectable, InjectionToken } from '@angular/core';
import { distinctUntilChanged, Observable } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class IsFetching {
  private queryClient = injectQueryClient();
  private destroyRef = inject(DestroyRef);

  use(filters?: QueryFilters) {
    const result$ = new Observable<number>((observer) => {
      observer.next(this.queryClient.isFetching(filters));
      const disposeSubscription = this.queryClient.getQueryCache().subscribe(
        notifyManager.batchCalls(() => {
          observer.next(this.queryClient.isFetching(filters));
        })
      );

      return () => disposeSubscription();
    }).pipe(
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    );

    return {
      result$,
      toSignal: () => toSignal(result$),
    };
  }
}

const UseIsFetching = new InjectionToken<IsFetching['use']>(
  'UseIsFetching',
  {
    providedIn: 'root',
    factory() {
      const isFetching = new IsFetching();
      return isFetching.use.bind(isFetching);
    },
  }
);

export function injectIsFetching() {
  return inject(UseIsFetching);
}
