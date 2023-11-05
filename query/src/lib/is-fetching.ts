import { QueryFilters, notifyManager } from '@tanstack/query-core';
import { injectQueryClient } from './query-client';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { distinctUntilChanged, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IsFetchingService {
  private queryClient = injectQueryClient();

  use(filters?: QueryFilters) {
    return new Observable<number>((observer) => {
      observer.next(this.queryClient.isFetching(filters));
      this.queryClient.getQueryCache().subscribe(
        notifyManager.batchCalls(() => {
          observer.next(this.queryClient.isFetching(filters));
        })
      );
    }).pipe(distinctUntilChanged());
  }
}

const UseIsFetching = new InjectionToken<IsFetchingService['use']>(
  'UseIsFetching',
  {
    providedIn: 'root',
    factory() {
      const isFetching = new IsFetchingService();
      return isFetching.use.bind(isFetching);
    },
  }
);

export function injectIsFetching() {
  return inject(UseIsFetching);
}
