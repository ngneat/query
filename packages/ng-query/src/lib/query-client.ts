import { inject, InjectionToken } from '@angular/core';
import { QueryClient as QueryCore } from '@tanstack/query-core';
import { QUERY_CLIENT_OPTIONS } from './providers';

export const QueryClientService = new InjectionToken<QueryCore>(
  'QueryClientService',
  {
    providedIn: 'root',
    factory() {
      const options = inject(QUERY_CLIENT_OPTIONS);

      return new QueryCore({
        ...options,
        defaultOptions: {
          ...options?.defaultOptions,
          queries: {
            staleTime: Infinity,
            ...options?.defaultOptions?.queries,
          },
        },
      });
    },
  }
);
