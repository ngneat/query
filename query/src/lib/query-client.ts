import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  InjectionToken,
  OnDestroy,
  PLATFORM_ID,
  Provider,
} from '@angular/core';
import { QueryClient as _QueryClient } from '@tanstack/query-core';
import { QUERY_CLIENT_OPTIONS } from './query-client-options';

const QueryClient = new InjectionToken<_QueryClient>('QueryClient', {
  providedIn: 'root',
  factory() {
    return new _QueryClient(inject(QUERY_CLIENT_OPTIONS));
  },
});

@Injectable({
  providedIn: 'root',
})
class QueryClientMount implements OnDestroy {
  instance = inject(QueryClient);

  constructor() {
    this.instance.mount();
  }

  ngOnDestroy() {
    this.instance.unmount();
  }
}

const QueryClientService = new InjectionToken<_QueryClient>(
  'QueryClientService',
  {
    providedIn: 'root',
    factory() {
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        inject(QueryClientMount);
      }

      return inject(QueryClient);
    },
  },
);

/** @public */
export function provideQueryClient(queryClient: _QueryClient): Provider {
  return {
    provide: QueryClient,
    useValue: queryClient,
  };
}

/** @public */
export function injectQueryClient() {
  return inject(QueryClientService);
}
