# ngneat/query-devtools

Wave your hands in the air and shout hooray because Angular Query comes with dedicated devtools! 🥳

When you begin your Angular Query journey, you'll want these devtools by your side. They help visualize all of the inner workings of Angular Query and will likely save you hours of debugging if you find yourself in a pinch!

Install the `@ngneat/query-devtools` package. Lazy load and use it only in `development` environment:

```ts
import { provideQueryDevTools } from '@ngneat/query';
import { environment } from 'src/environments/environment';

bootstrapApplication(AppComponent, {
  providers: [environment.production ? [] : provideQueryDevTools(options)],
});
```

See all the available options [here](https://tanstack.com/query/v5/docs/react/devtools#options).

# Recipes

## Devtools in Production

If you would like to lazy-load devtools in production, you can use something similar to the following:

```ts
import { onlineManager } from '@tanstack/query-core';
import { APP_INITIALIZER } from '@angular/core';
import { injectQueryClient } from '@ngneat/query';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...other providers...
    environment.production
      ?  {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: provideLazyQueryDevTools,
        },
      : provideQueryDevTools(options),
  ],
};

function provideLazyQueryDevTools() {
  const client = injectQueryClient();
  return () => {
    // Define our global `toggleDevtools()` function to lazy-load query devtools
    window.toggleDevtools = () => {
      import('@tanstack/query-devtools').then((d) => {
        new d.TanstackQueryDevtools({
          client,
          queryFlavor: '@ngneat/query',
          version: '5',
          position: 'bottom',
          initialIsOpen: true,
          buttonPosition: 'bottom-right',
          onlineManager,
        }).mount(document.body);
      });
    };
  };
}
```

This will define a global window function `window.toggleDevtools()` - open the developer console and call this to lazy-load and mount the devtools.
See also [Devtools in production](https://tanstack.com/query/v4/docs/react/devtools#devtools-in-production).
