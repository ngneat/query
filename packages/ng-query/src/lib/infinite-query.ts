import { inject, Injectable, InjectionToken } from '@angular/core';

import { QueryClient } from './query-client';

@Injectable({ providedIn: 'root' })
class InfiniteQuery {
  private instance = inject(QueryClient);
  use() {}
}

export const InfiniteQueryProvider = new InjectionToken<InfiniteQuery['use']>(
  'InfiniteQueryProvider',
  {
    providedIn: 'root',
    factory() {
      const query = new InfiniteQuery();
      return query.use.bind(query);
    },
  }
);
