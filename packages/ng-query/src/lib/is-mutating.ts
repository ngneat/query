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

    return new Observable<number>((obs) => {
      obs.next(0);
      this.instance.getMutationCache().subscribe(
        notifyManager.batchCalls(() => {
          obs.next(this.instance.isMutating(filters));
        })
      );
    }).pipe(distinctUntilChanged());
  }
}

export type UseIsMutating = IsMutating['use'];

export const IsMutatingProvider = new InjectionToken<UseIsMutating>(
  'IsIsMutating',
  {
    providedIn: 'root',
    factory() {
      const query = new IsMutating();
      return query.use.bind(query);
    },
  }
);
