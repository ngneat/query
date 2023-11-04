import {TanstackQueryDevtoolsConfig} from '@tanstack/query-devtools';
import {DestroyRef, ENVIRONMENT_INITIALIZER, inject, makeEnvironmentProviders} from '@angular/core';
import {QueryClientService} from '@ngneat/query';

export function provideQueryClientDevTools(
  isProductionEnvironment: boolean,
  devToolOptions: Partial<Omit<TanstackQueryDevtoolsConfig, 'client'>> = {}
) {
  return makeEnvironmentProviders([
    isProductionEnvironment
      ? []
      : {
        provide: ENVIRONMENT_INITIALIZER,
        multi: true,
        useValue() {
          const queryClient = inject(QueryClientService);
          const destroyRef = inject(DestroyRef);
          import('./devtools').then((m) => {
            m.ngQueryDevtools({ queryClient, destroyRef, ...devToolOptions });
          });
        },
      },
  ]);
}
