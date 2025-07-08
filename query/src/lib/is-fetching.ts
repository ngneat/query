import { notifyManager, type QueryFilters } from '@tanstack/query-core';
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
export const IsFetchingToken = new InjectionToken<IsFetching>('IsFetching', {
  providedIn: 'root',
  factory() {
    return new IsFetching();
  },
});

export interface IsFetchingObject {
  use: (filters?: QueryFilters) => {
    result$: Observable<number>;
    toSignal: () => Signal<number | undefined>;
  };
}

/** @internal
 * only exported for @test
 */
export class IsFetching implements IsFetchingObject {
  #queryClient = injectQueryClient();

  use(filters?: QueryFilters) {
    const result$ = new Observable<number>((observer) => {
      observer.next(this.#queryClient.isFetching(filters));
      const disposeSubscription = this.#queryClient.getQueryCache().subscribe(
        notifyManager.batchCalls(() => {
          observer.next(this.#queryClient.isFetching(filters));
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

function isFetchingUseFnFromToken() {
  const isFetching = inject(IsFetchingToken);
  return isFetching.use.bind(isFetching);
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
 *  const isFetching = injectIsFetching({ injector: this.injector });
 * }
 *
 */
export function injectIsFetching(options?: { injector?: Injector }) {
  if (options?.injector) {
    return runInInjectionContext(options.injector, () =>
      isFetchingUseFnFromToken(),
    );
  }

  assertInInjectionContext(injectIsFetching);

  return isFetchingUseFnFromToken();
}
