import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import {
  QueryCache,
  QueryClientConfigFn,
  provideQueryClientOptions,
} from '@ngneat/query';
import { provideQueryDevTools } from '@ngneat/query-devtools';
import { appRoutes } from './app.routes';
import { NotificationService } from './services/notification.service';

const withFunctionaFactory: QueryClientConfigFn = () => {
  // we can use an injector context here and resolve a service
  const notificationService = inject(NotificationService);

  return {
    queryCache: new QueryCache({
      onError: (error: Error) => notificationService.notifyError(error),
    }),
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(),
    provideQueryClientOptions(withFunctionaFactory),
    provideQueryDevTools(),
  ],
};
