import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  MutationFilters,
  MutationKey,
  notifyManager,
  parseMutationFilterArgs,
} from '@tanstack/query-core';
import { distinctUntilChanged, Observable } from 'rxjs';

import { QueryClient } from './query-client';

@Injectable({ providedIn: 'root' })
class IsMutating {
  private instance = inject(QueryClient);

  use(filters?: MutationFilters): Observable<number>;
  use(
    mutationKey?: MutationKey,
    filters?: Omit<MutationFilters, 'mutationKey'>
  ): Observable<number>;
  use(
    arg1?: MutationKey | MutationFilters,
    arg2?: Omit<MutationFilters, 'mutationKey'>
  ): Observable<number> {
    const [filters] = parseMutationFilterArgs(arg1, arg2);

    return new Observable<number>((obs) =>
      this.instance.getMutationCache().subscribe(
        notifyManager.batchCalls(() => {
          obs.next(this.instance.isMutating(filters));
        })
      )
    ).pipe(distinctUntilChanged());
  }
}

export const IsMutatingProvider = new InjectionToken<IsMutating['use']>(
  'IsIsMutating',
  {
    providedIn: 'root',
    factory() {
      const query = new IsMutating();
      return query.use.bind(query);
    },
  }
);
