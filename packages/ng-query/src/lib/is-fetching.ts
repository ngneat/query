import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  notifyManager,
  parseFilterArgs,
  QueryFilters,
  QueryKey,
} from '@tanstack/query-core';
import { distinctUntilChanged, Observable } from 'rxjs';

import { QueryClient } from './query-client';

@Injectable({ providedIn: 'root' })
class IsFetching {
  private instance = inject(QueryClient);

  use(filters?: QueryFilters): Observable<number>;
  use(queryKey?: QueryKey, filters?: QueryFilters): Observable<number>;
  use(arg1?: QueryKey | QueryFilters, arg2?: QueryFilters): Observable<number> {
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

export const IsFetchingProvider = new InjectionToken<IsFetching['use']>(
  'IsFetching',
  {
    providedIn: 'root',
    factory() {
      const query = new IsFetching();
      return query.use.bind(query);
    },
  }
);
