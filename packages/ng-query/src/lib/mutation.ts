import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  MutationObserver,
  MutationObserverOptions,
  MutationObserverResult,
  notifyManager,
} from '@tanstack/query-core';
import { Observable, Subscription } from 'rxjs';

import { QueryClientService } from './query-client';

@Injectable({ providedIn: 'root' })
export class MutationService {
  private instance = inject(QueryClientService);

  use<TData, TError, TVariables>(
    mutationFn: (vars: TVariables) => Observable<TData>,
    options: Omit<
      MutationObserverOptions<TData, TError, TVariables>,
      'mutationFn'
    > = {}
  ): {
    result$: Observable<MutationObserverResult<TData, TError, TVariables>>;
  } & MutationObserver<TData, TError, TVariables> {
    const sourceSubscription = new Subscription();

    const mutationObserver = new MutationObserver<TData, TError, TVariables>(
      this.instance,
      {
        ...options,
        mutationFn(vars) {
          return new Promise<TData>((res, rej) => {
            const subscription = mutationFn(vars).subscribe({
              next: res,
              error: rej,
            });

            sourceSubscription.add(subscription);
          });
        },
      }
    );

    (mutationObserver as any)['result$'] = new Observable((observer) => {
      observer.next(mutationObserver.getCurrentResult());

      const mutationObserverDispose = mutationObserver.subscribe(
        notifyManager.batchCalls((result) => {
          observer.next(result);
        })
      );

      return () => {
        sourceSubscription.unsubscribe();
        mutationObserverDispose();
      };
    });

    return mutationObserver as {
      result$: Observable<MutationObserverResult<TData, TError, TVariables>>;
    } & MutationObserver<TData, TError, TVariables>;
  }
}

export const UseMutation = new InjectionToken<MutationService['use']>(
  'MutationProvider',
  {
    providedIn: 'root',
    factory() {
      const mutation = new MutationService();
      return mutation.use.bind(mutation);
    },
  }
);
