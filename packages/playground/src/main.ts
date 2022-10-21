import {
  enableProdMode,
  ENVIRONMENT_INITIALIZER,
  importProvidersFrom,
  inject,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { BasicPageComponent } from './app/basic-page/basic-page.component';
import { InfiniteQueryPageComponent } from './app/infinite-query-page/infinite-query-page.component';
import { PaginationPageComponent } from './app/pagination-page/pagination-page.component';
import { SimplePageComponent } from './app/simple-page/simple-page.component';
import { DynamicQueriesPageComponent } from './app/dynamic-queries-page/dynamic-queries-page.component';
import { QueryClient } from '@ngneat/query';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // This is to enable devtools in the playground
    // For your application, please check environment.production as the following
    // environment.production
    //   ? []
    //   : {
    //       provide: ENVIRONMENT_INITIALIZER,
    //       multi: true,
    //       useValue() {
    //         const queryClient = inject(QueryClient);
    //         import('@ngneat/query-devtools').then((m) => {
    //           m.ngQueryDevtools({ queryClient });
    //         });
    //       },
    //     },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        const queryClient = inject(QueryClient);
        import('@ngneat/query-devtools').then((m) => {
          m.ngQueryDevtools({ queryClient });
        });
      },
    },
    importProvidersFrom(
      HttpClientModule,
      RouterModule.forRoot(
        [
          {
            path: '',
            component: SimplePageComponent,
          },
          {
            path: 'basic',
            component: BasicPageComponent,
          },
          {
            path: 'dynamic',
            component: DynamicQueriesPageComponent,
          },
          {
            path: 'infinite',
            component: InfiniteQueryPageComponent,
          },
          {
            path: 'pagination',
            component: PaginationPageComponent,
          },
        ],
        { initialNavigation: 'enabledBlocking' }
      )
    ),
  ],
}).catch((err) => console.error(err));
