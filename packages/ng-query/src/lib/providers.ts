import { InjectionToken } from '@angular/core';
import { QueryClientConfig } from '@tanstack/query-core';

export const QUERY_CLIENT_CONFIG = new InjectionToken<QueryClientConfig>(
  'QUERY_CLIENT_CONFIG',
  {
    providedIn: 'root',
    factory() {
      return {};
    },
  }
);
