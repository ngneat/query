import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  MutationFilters,
  MutationKey,
  notifyManager,
  parseMutationFilterArgs,
} from '@tanstack/query-core';
import { distinctUntilChanged, Observable } from 'rxjs';

import { QueryClientService } from './query-client';

@Injectable({ providedIn: 'root' })
export class IsMutatingService {
  private instance = inject(QueryClientService);

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
