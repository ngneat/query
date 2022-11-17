import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Injectable,
  InjectionToken,
  OnDestroy,
  PLATFORM_ID,
  Provider,
} from '@angular/core';
import { QueryClient as QueryCore } from '@tanstack/query-core';
import { QUERY_CLIENT_OPTIONS } from './providers';

const QueryClient = new InjectionToken<QueryCore>('QueryClient', {
  providedIn: 'root',
  factory() {
    return new QueryCore(inject(QUERY_CLIENT_OPTIONS));
  },
});

export const provideQueryClient = (queryClient: QueryCore): Provider => {
  return {
    provide: QueryClient,
    useValue: queryClient,
  };
};

@Injectable({
  providedIn: 'root',
})
class QueryClientHooks implements OnDestroy {
  instance = inject(QueryClient);
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    if (this.isBrowser) {
      this.instance.mount();
    }
  }
  ngOnDestroy() {
    if (this.isBrowser) {
      this.instance.unmount();
    }
  }
}

export const QueryClientService = new InjectionToken<QueryCore>(
  'QueryClientService',
  {
    providedIn: 'root',
    factory() {
      inject(QueryClientHooks);
      return inject(QueryClient);
    },
  }
);
