import { inject, Injectable, InjectionToken } from '@angular/core';
import {
  MutationObserver,
  MutationObserverOptions,
  MutationObserverResult,
  notifyManager,
} from '@tanstack/query-core';
import { Observable, Subscription } from 'rxjs';

import { QueryClient } from './query-client';

@Injectable({ providedIn: 'root' })
class Mutation {
  private instance = inject(QueryClient);

  use<TData, TError, TVariables>(
    mutationFn: (vars: TVariables) => Observable<TData>,
    options: Omit<
      MutationObserverOptions<TData, TError, TVariables>,
      'mutationFn'
    > = {}
  ): {
    mutate: MutationObserver<TData, TError, TVariables>['mutate'];
    mutationObserver: MutationObserver<TData, TError, TVariables>;
  } & Observable<MutationObserverResult<TData, TError, TVariables>> & {
      instance: MutationObserver<TData, TError, TVariables>;
    } {
    const sourceSubscription = new Subscription();

    const mutationObserver = new MutationObserver<TData, TError, TVariables>(
      this.instance,
      {
        ...options,
        mutationFn: (vars) => {
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

    const $ = new Observable((observer) => {
      observer.next(mutationObserver.getCurrentResult());

      const mutationObserverDispose = mutationObserver.subscribe(
        notifyManager.batchCalls((result) => {
          observer.next(result);
        })
      );

      return () => {
        console.log('mutationObserver unsubscribed');
        sourceSubscription.unsubscribe();
        mutationObserverDispose();
      };
    }) as any;

    $['mutate'] = mutationObserver.mutate.bind(mutationObserver);
    $['instance'] = mutationObserver;

    return $;
  }
}

export const MutationProvider = new InjectionToken<Mutation['use']>(
  'MutationProvider',
  {
    providedIn: 'root',
    factory() {
      const mutation = new Mutation();
      return mutation.use.bind(mutation);
    },
  }
);
