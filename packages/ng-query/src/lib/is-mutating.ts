import {inject, Injectable, InjectionToken} from '@angular/core';
import {MutationFilters, notifyManager} from '@tanstack/query-core';
import {distinctUntilChanged, Observable} from 'rxjs';

import {QueryClientService} from './query-client';

@Injectable({ providedIn: 'root' })
export class IsMutatingService {
  private instance = inject(QueryClientService);

  use(filters?: MutationFilters): Observable<number> {
    return new Observable<number>((obs) => {
      obs.next(this.instance.isMutating(filters));
      this.instance.getMutationCache().subscribe(
        notifyManager.batchCalls(() => {
          obs.next(this.instance.isMutating(filters));
        })
      );
    }).pipe(distinctUntilChanged());
  }
}

export type UseIsMutating = IsMutatingService['use'];

export const UseIsMutating = new InjectionToken<UseIsMutating>(
  'UseIsMutating',
  {
    providedIn: 'root',
    factory() {
      const query = new IsMutatingService();
      return query.use.bind(query);
    },
  }
);
