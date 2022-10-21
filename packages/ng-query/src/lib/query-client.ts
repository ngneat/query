import { inject, InjectionToken } from '@angular/core';
import { QueryClient as QueryCore } from '@tanstack/query-core';
import { QUERY_CLIENT_OPTIONS } from './providers';

export const QueryClient = new InjectionToken<QueryCore>('QueryClient', {
  providedIn: 'root',
  factory() {
    const options = inject(QUERY_CLIENT_OPTIONS);

    return new QueryCore({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          ...options?.defaultOptions?.queries,
        },
      },
      ...options,
    });
  },
});
