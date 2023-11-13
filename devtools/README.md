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

See all the avilable options [here](https://tanstack.com/query/v5/docs/react/devtools#options).
