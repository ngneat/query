import { inject, InjectionToken } from '@angular/core';
import { QueryClient as QueryCore } from '@tanstack/query-core';
import { QUERY_CLIENT_CONFIG } from './providers';

export const QueryClient = new InjectionToken<QueryCore>('QueryClient', {
  providedIn: 'root',
  factory() {
    const config = inject(QUERY_CLIENT_CONFIG);

    return new QueryCore({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          ...config?.defaultOptions?.queries,
        },
      },
      ...config,
    });
  },
});
