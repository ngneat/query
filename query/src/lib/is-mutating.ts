import {
  type MutationFilters,
  notifyManager
} from '@tanstack/query-core';
import { injectQueryClient } from './query-client';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { distinctUntilChanged, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IsMutatingService {
  private queryClient = injectQueryClient();

  use(filters?: MutationFilters) {
    return new Observable<number>((observer) => {
      observer.next(this.queryClient.isMutating(filters));
      this.queryClient.getMutationCache().subscribe(
        notifyManager.batchCalls(() => {
          observer.next(this.queryClient.isMutating(filters));
        })
      );
    }).pipe(distinctUntilChanged());
  }
}

const UseIsMutating = new InjectionToken<IsMutatingService['use']>(
  'UseIsFetching',
  {
    providedIn: 'root',
    factory() {
      const isMutating = new IsMutatingService();
      return isMutating.use.bind(isMutating);
    },
  }
);

export function injectIsMutating() {
  return inject(UseIsMutating);
}
