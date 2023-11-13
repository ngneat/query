import {
  DestroyRef,
  ENVIRONMENT_INITIALIZER,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { TanstackQueryDevtoolsConfig } from '@tanstack/query-devtools';
import { injectQueryClient } from '@ngneat/query';

export function provideQueryDevTools(
  devToolOptions: Partial<Omit<TanstackQueryDevtoolsConfig, 'client'>> = {},
) {
  return makeEnvironmentProviders([
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        const queryClient = injectQueryClient();
        const destroyRef = inject(DestroyRef);

        import('./lib/devtools/devtools').then((m) => {
          m.queryDevtools({ queryClient, destroyRef, ...devToolOptions });
        });
      },
    },
  ]);
}
