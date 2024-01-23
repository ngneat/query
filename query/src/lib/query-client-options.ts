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
    {
      provide: QUERY_CLIENT_OPTIONS,
      [typeof options === 'function' ? 'useFactory' : 'useValue']: options,
    } as any,
  ]);
}
