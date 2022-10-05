import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  notifyManager,
  parseFilterArgs,
  QueryFilters,
  QueryKey,
} from '@tanstack/query-core';
import { distinctUntilChanged, Observable } from 'rxjs';

import { QUERY_CLIENT } from './query-client';

@Injectable({ providedIn: 'root' })
class IsFetching {
  private instance = inject(QUERY_CLIENT);

  query(filters?: QueryFilters): Observable<number>;
  query(queryKey?: QueryKey, filters?: QueryFilters): Observable<number>;
  query(
    arg1?: QueryKey | QueryFilters,
    arg2?: QueryFilters
  ): Observable<number> {
    const [filters] = parseFilterArgs(arg1, arg2);

    return new Observable<number>((obs) =>
      this.instance.getQueryCache().subscribe(
        notifyManager.batchCalls(() => {
          obs.next(this.instance.isFetching(filters));
        })
      )
    ).pipe(distinctUntilChanged());
  }
}

export const IsFetchingProvider = new InjectionToken<IsFetching['query']>(
  'IsFetching',
  {
    providedIn: 'root',
    factory() {
      const query = new IsFetching();
      return query.query.bind(query);
    },
  }
);
