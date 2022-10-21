import { InjectionToken } from '@angular/core';
import { QueryClientConfig } from '@tanstack/query-core';

export const QUERY_CLIENT_OPTIONS = new InjectionToken<QueryClientConfig>(
  'QUERY_CLIENT_OPTIONS',
  {
    providedIn: 'root',
    factory() {
      return {};
    },
  }
);
