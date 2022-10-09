import { inject, Injectable, InjectionToken } from '@angular/core';

import { QueryClient } from './query-client';

@Injectable({ providedIn: 'root' })
class InfiniteQuery {
  private instance = inject(QueryClient);
  query() {}
}

export const InfiniteQueryProvider = new InjectionToken<InfiniteQuery['query']>(
  'InfiniteQueryProvider',
  {
    providedIn: 'root',
    factory() {
      const query = new InfiniteQuery();
      return query.query.bind(query);
    },
  }
);
