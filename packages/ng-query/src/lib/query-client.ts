import { inject, InjectionToken } from '@angular/core';
import { QueryClient } from '@tanstack/query-core';
import { QUERY_CLIENT_CONFIG } from './providers';

export const QUERY_CLIENT = new InjectionToken<QueryClient>('QUERY_CLIENT', {
  providedIn: 'root',
  factory() {
    const config = inject(QUERY_CLIENT_CONFIG);

    return new QueryClient({
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
