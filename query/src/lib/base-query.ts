import {
  DefaultError,
  QueryClient,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  WithRequired,
} from '@tanstack/query-core';
import { Observable, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Injector,
  Signal,
  assertInInjectionContext,
  runInInjectionContext,
} from '@angular/core';

export interface Options {
  injector?: Injector;
}

export interface CreateBaseQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> extends WithRequired<
      QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
      'queryKey'
    >,
    Options {}

export function createBaseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey
>({
  client,
  Observer,
  options,
  injector,
}: {
  client: QueryClient;
  Observer: typeof QueryObserver;
  options: CreateBaseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >;
  injector: Injector;
}): any {
  let queryObserver:
    | QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>
    | undefined;

  const defaultedOptions = client.defaultQueryOptions(options);
  defaultedOptions._optimisticResults = 'optimistic';

  const originalQueryFn = defaultedOptions.queryFn;

  if (originalQueryFn) {
    defaultedOptions.queryFn = function (options: any) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this;

      return runInInjectionContext(injector, () => {
        return originalQueryFn.call(_this, options);
      });
    };
  }

  const result$ = new Observable((observer) => {
    // Lazily create the observer when the first subscription is received
    if (!queryObserver) {
      queryObserver = new Observer<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        TQueryKey
      >(client, defaultedOptions);
    }

    observer.next(queryObserver.getOptimisticResult(defaultedOptions));

    const queryObserverDispose = queryObserver.subscribe((result) => {
      observer.next(
        defaultedOptions.notifyOnChangeProps
          ? result
          : queryObserver?.trackResult(result)
      );
    });

    return () => {
      queryObserverDispose();
      queryObserver = undefined;
    };
  }).pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  let cachedSignal: undefined | Signal<any>;

  return {
    result$,
    updateOptions(options: QueryObserver['setOptions']) {
      queryObserver?.setOptions(
        {
          ...defaultedOptions,
          ...options,
        },
        { listeners: false }
      );
    },
    // @experimental signal support
    get result() {
      assertInInjectionContext(function queryResultSignal() {
        // noop
      });

      if (!cachedSignal) {
        cachedSignal = toSignal(this.result$, {
          requireSync: true,
          // R3Injector isn't good here because it will cause a leak
          // We only need the NodeInjector as we want the subscription to be destroyed when the component is destroyed
          // We check it's a NodeInjector by checking if it has a _tNode property
          // Otherwise we just pass undefined and it'll use the current injector
          injector: (injector as any)['_tNode'] ? injector : undefined,
        });
      }

      return cachedSignal;
    },
  };
}
