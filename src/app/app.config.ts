import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, inject } from '@angular/core';
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

class MyErrorHandler extends ErrorHandler {
  override handleError(error: any) {
    return super.handleError(error);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: MyErrorHandler },
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(),
    provideQueryClientOptions(withFunctionaFactory),
    provideQueryDevTools(),
  ],
};
