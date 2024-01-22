import {
  APP_INITIALIZER,
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

export function provideLazyQueryDevTools(
  devToolOptions: Partial<Omit<TanstackQueryDevtoolsConfig, 'client'>> = {},
  triggerFunction: string = 'toggleDevtools',
) {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory() {
        const queryClient = injectQueryClient();
        const destroyRef = inject(DestroyRef);
        return () => {
          (window as any)[triggerFunction] = () => {
            import('./lib/devtools/devtools').then((m) => {
              m.queryDevtools({ queryClient, destroyRef, ...devToolOptions });
            });
          };
        };
      },
    },
  ]);
}
