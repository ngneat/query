import { inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { QueryClient as QueryCore } from '@tanstack/query-core';
import { QUERY_CLIENT_OPTIONS } from './providers';

export const QueryClient = new InjectionToken<QueryCore>('QueryClient', {
  providedIn: 'root',
  factory() {
    return new QueryCore(inject(QUERY_CLIENT_OPTIONS));
  },
});

@Injectable({
  providedIn: 'root',
})
class QueryClientHooks implements OnDestroy {
  instance = inject(QueryClient);
  constructor() {
    this.instance.mount();
  }
  ngOnDestroy() {
    this.instance.unmount();
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
