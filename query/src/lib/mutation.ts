import { inject, InjectionToken } from '@angular/core';
import { injectQueryClient } from './query-client';
import {
  DefaultError,
  MutationObserver,
  type MutationObserverOptions,
  type MutationObserverResult,
  notifyManager,
} from '@tanstack/query-core';
import { firstValueFrom, isObservable, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

type CreateMutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
> = Omit<
  MutationObserverOptions<TData, TError, TVariables, TContext>,
  'mutationFn'
> & {
  mutationFn: (variables: TVariables) => Promise<TData> | Observable<TData>;
};

class Mutation {
  private instance = injectQueryClient();

  use<
    TData = unknown,
    TError = DefaultError,
    TVariables = unknown,
    TContext = unknown
  >(options: CreateMutationOptions<TData, TError, TVariables, TContext>) {
    const mutationObserver = new MutationObserver<
      TData,
      TError,
      TVariables,
      TContext
    >(this.instance, {
      ...options,
      mutationFn: (variables: TVariables): Promise<TData> => {
        const result: Promise<TData> | Observable<TData> =
          options.mutationFn(variables);
        if (isObservable(result)) return firstValueFrom(result);
        return result;
      },
    });

    const result$ = new Observable<
      MutationObserverResult<TData, TError, TVariables, TContext>
    >((observer) => {
      observer.next(mutationObserver.getCurrentResult());

      const disposeSubscription = mutationObserver.subscribe(
        notifyManager.batchCalls(
          (
            result: MutationObserverResult<TData, TError, TVariables, TContext>
          ) => observer.next(result)
        )
      );

      return () => disposeSubscription();
    });

    return {
      result$,
      toSignal: () => toSignal(result$),
    };
  }
}

const UseMutation = new InjectionToken('UseMutation', {
  providedIn: 'root',
  factory() {
    const mutation = new Mutation();
    return mutation.use.bind(mutation);
  },
});

export function injectMutation() {
  return inject(UseMutation);
}
