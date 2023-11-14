import {
  DefaultError,
  QueryClient,
  QueryFunctionContext,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  WithRequired,
} from '@tanstack/query-core';
import { Observable, from, isObservable, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Injector,
  Signal,
  assertInInjectionContext,
  runInInjectionContext,
} from '@angular/core';
import { toPromise } from './utils';

export type QueryFunctionWithObservable<
  T = unknown,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
> = (
  context: QueryFunctionContext<TQueryKey, TPageParam>,
) => T | Promise<T> | Observable<T>;

export interface Options {
  injector?: Injector;
}

interface _CreateBaseQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends WithRequired<
      QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
      'queryKey'
    >,
    Options {}

export type CreateBaseQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  _CreateBaseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  'queryFn'
> & {
  queryFn: QueryFunctionWithObservable<TQueryFnData, TQueryKey>;
};

export function createBaseQuery<
  TQueryFnData,
  TError,
  TData,
  TQueryData,
  TQueryKey extends QueryKey,
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

  const defaultedOptions = client.defaultQueryOptions(
    options as unknown as QueryObserverOptions,
  );
  defaultedOptions._optimisticResults = 'optimistic';

  const originalQueryFn = defaultedOptions.queryFn;

  if (originalQueryFn) {
    defaultedOptions.queryFn = function (ctx: QueryFunctionContext) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this;

      return runInInjectionContext(injector, () => {
        const value = originalQueryFn.call(_this, ctx);

        if (isObservable(value)) {
          return toPromise({ source: value, signal: ctx.signal });
        }

        return value;
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
      >(client, defaultedOptions as any);
    }

    observer.next(queryObserver.getOptimisticResult(defaultedOptions as any));

    const queryObserverDispose = queryObserver.subscribe((result) => {
      observer.next(
        defaultedOptions.notifyOnChangeProps
          ? result
          : queryObserver?.trackResult(result),
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
    }),
  );

  let cachedSignal: undefined | Signal<any>;
  const isNodeInjector = injector && (injector as any)['_tNode'];

  return {
    result$,
    updateOptions(options: QueryObserver['setOptions']) {
      queryObserver?.setOptions(
        {
          ...defaultedOptions,
          ...options,
        } as any,
        { listeners: false },
      );
    },
    // @experimental signal support
    get result() {
      !isNodeInjector &&
        assertInInjectionContext(function queryResultSignal() {
          // noop
        });

      if (!cachedSignal) {
        cachedSignal = toSignal(this.result$, {
          requireSync: true,
          // R3Injector isn't good here because it will cause a leak
          // We only need the NodeInjector as we want the subscription to be destroyed when the component is destroyed
          // We check that it's a NodeInjector by checking if it has a _tNode property
          // Otherwise we just pass undefined and it'll use the current injector
          // and not the R3Injector that we pass in the service
          injector: isNodeInjector ? injector : undefined,
        });
      }

      return cachedSignal;
    },
  };
}
