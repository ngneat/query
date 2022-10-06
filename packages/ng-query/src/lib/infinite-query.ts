import { inject, Injectable, InjectionToken } from '@angular/core';

import { QUERY_CLIENT } from './query-client';

@Injectable({ providedIn: 'root' })
class InfiniteQuery {
  private instance = inject(QUERY_CLIENT);
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
