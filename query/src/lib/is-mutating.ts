import { type MutationFilters, notifyManager } from '@tanstack/query-core';
import { injectQueryClient } from './query-client';
import {
  assertInInjectionContext,
  inject,
  InjectionToken,
  Injector,
  runInInjectionContext,
  Signal,
} from '@angular/core';
import { distinctUntilChanged, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

/** @internal */
export const IsMutatingToken = new InjectionToken<IsMutating>('IsMutating', {
  providedIn: 'root',
  factory() {
    return new IsMutating();
  },
});

export interface IsMutatingObject {
  use: (filters?: MutationFilters) => {
    result$: Observable<number>;
    toSignal: () => Signal<number | undefined>;
  };
}

/** @internal
 * only exported for @test
 */
export class IsMutating implements IsMutatingObject {
  #queryClient = injectQueryClient();

  use(filters?: MutationFilters) {
    const result$ = new Observable<number>((observer) => {
      observer.next(this.#queryClient.isMutating(filters));
      const disposeSubscription = this.#queryClient
        .getMutationCache()
        .subscribe(
          notifyManager.batchCalls(() => {
            observer.next(this.#queryClient.isMutating(filters));
          }),
        );

      return () => disposeSubscription();
    }).pipe(distinctUntilChanged());

    return {
      result$,
      toSignal: () => toSignal(result$),
    };
  }
}

function isMutatingUseFnFromToken() {
  const isMutating = inject(IsMutatingToken);
  return isMutating.use.bind(isMutating);
}

/**
 *
 * Optionally pass an injector that will be used than the current one.
 * Can be useful if you want to use it in ngOnInit hook for example.
 *
 * @example
 *
 * injector = inject(Injector);
 *
 * ngOnInit() {
 *  const isMutating = injectIsMutating({ injector: this.injector });
 * }
 *
 */
export function injectIsMutating(options?: { injector?: Injector }) {
  if (options?.injector) {
    return runInInjectionContext(options.injector, () =>
      isMutatingUseFnFromToken(),
    );
  }

  assertInInjectionContext(injectIsMutating);

  return isMutatingUseFnFromToken();
}
