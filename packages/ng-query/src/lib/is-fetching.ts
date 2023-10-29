import {inject, Injectable, InjectionToken} from '@angular/core';
import {notifyManager, QueryFilters} from '@tanstack/query-core';
import {distinctUntilChanged, Observable} from 'rxjs';

import {QueryClientService} from './query-client';

@Injectable({ providedIn: 'root' })
export class IsFetchingService {
  private instance = inject(QueryClientService);

  use(filters?: QueryFilters): Observable<number> {
    return new Observable<number>((obs) => {
      obs.next(this.instance.isFetching(filters));
      this.instance.getQueryCache().subscribe(
        notifyManager.batchCalls(() => {
          obs.next(this.instance.isFetching(filters));
        })
      );
    }).pipe(distinctUntilChanged());
  }
}

export type UseIsFetching = IsFetchingService['use'];

export const UseIsFetching = new InjectionToken<UseIsFetching>(
  'UseIsFetching',
  {
    providedIn: 'root',
    factory() {
      const query = new IsFetchingService();
      return query.use.bind(query);
    },
  }
);
