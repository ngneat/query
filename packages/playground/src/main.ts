import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BasicPageComponent } from './app/basic-page/basic-page.component';
import { MutationsPageComponent } from './app/mutations-page/mutations-page.component';

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
            component: BasicPageComponent,
          },
          {
            path: 'mutations',
            component: MutationsPageComponent,
          },
        ],
        { initialNavigation: 'enabledBlocking' }
      )
    ),
  ],
}).catch((err) => console.error(err));
