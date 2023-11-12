import { type MutationFilters, notifyManager } from '@tanstack/query-core';
import { injectQueryClient } from './query-client';
import {
  assertInInjectionContext,
  inject,
  Injectable,
  InjectionToken,
} from '@angular/core';
import { distinctUntilChanged, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class IsMutating {
  #queryClient = injectQueryClient();

  use(filters?: MutationFilters) {
    const result$ = new Observable<number>((observer) => {
      observer.next(this.#queryClient.isMutating(filters));
      const disposeSubscription = this.#queryClient
        .getMutationCache()
        .subscribe(
          notifyManager.batchCalls(() => {
            observer.next(this.#queryClient.isMutating(filters));
          })
        );

      return () => disposeSubscription();
    }).pipe(distinctUntilChanged());

    return {
      result$,
      toSignal: () => toSignal(result$),
    };
  }
}

const UseIsMutating = new InjectionToken<IsMutating['use']>('UseIsFetching', {
  providedIn: 'root',
  factory() {
    const isMutating = new IsMutating();
    return isMutating.use.bind(isMutating);
  },
});

export function injectIsMutating() {
  assertInInjectionContext(injectIsMutating);

  return inject(UseIsMutating);
}
