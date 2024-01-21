import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';
import { QueryClientConfig } from '@tanstack/query-core';

export const QUERY_CLIENT_OPTIONS = new InjectionToken<QueryClientConfig>(
  'QUERY_CLIENT_OPTIONS',
  {
    providedIn: 'root',
    factory() {
      return {};
    },
  },
);

export type QueryClientConfigFn = () => QueryClientConfig;

export function provideQueryClientOptions(
  options: QueryClientConfig,
): EnvironmentProviders;
export function provideQueryClientOptions(
  options: QueryClientConfigFn,
): EnvironmentProviders;
export function provideQueryClientOptions(
  options: QueryClientConfig | QueryClientConfigFn,
) {
  return makeEnvironmentProviders([
    typeof options === 'function'
      ? {
          provide: QUERY_CLIENT_OPTIONS,
          useFactory: options,
        }
      : {
          provide: QUERY_CLIENT_OPTIONS,
          useValue: options,
        },
  ]);
}
