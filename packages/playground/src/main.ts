import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { BasicPageComponent } from './app/basic-page/basic-page.component';
import { MutationsPageComponent } from './app/mutations-page/mutations-page.component';
import { InfiniteQueryPageComponent } from './app/infinite-query-page/infinite-query-page.component';
import { PaginationPageComponent } from './app/pagination-page/pagination-page.component';
import { SimplePageComponent } from './app/simple-page/simple-page.component';
import { DynamicQueriesPageComponent } from './app/dynamic-queries-page/dynamic-queries-page.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
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
            path: 'mutations',
            component: MutationsPageComponent,
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
