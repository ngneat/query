> The TanStack Query (also known as react-query) adapter for Angular applications

Get rid of granular state management, manual refetching, and async spaghetti code. TanStack Query gives you declarative, always-up-to-date auto-managed queries and mutations that improve your developer experience.

## Features

✅ &nbsp;Observable & Signal Support  
✅ &nbsp;Backend agnostic  
✅ &nbsp;Dedicated Devtools  
✅ &nbsp;Auto Caching  
✅ &nbsp;Auto Refetching  
✅ &nbsp;Window Focus Refetching  
✅ &nbsp;Polling/Realtime Queries  
✅ &nbsp;Parallel Queries  
✅ &nbsp;Dependent Queries  
✅ &nbsp;Mutations API  
✅ &nbsp;Automatic Garbage Collection  
✅ &nbsp;Paginated/Cursor Queries  
✅ &nbsp;Load-More/Infinite Scroll Queries  
✅ &nbsp;Request Cancellation  
✅ &nbsp;Prefetching  
✅ &nbsp;Offline Support  
✅ &nbsp;Data Selectors  
✅ &nbsp;SSR Support

<hr />

[![@ngneat/query](https://github.com/ngneat/query/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ngneat/query/actions/workflows/ci.yml)
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![coc-badge](https://img.shields.io/badge/codeof-conduct-ff69b4.svg?style=flat-square)]()
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e5079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Motivation

Discover the innovative approach TanStack Query takes to state management, setting it apart from traditional methods. Learn about the motivation behind this design and explore its unique features [here](https://tanstack.com/query/v5/docs/react/overview#motivation).

## Installation

```
npm i @ngneat/query
```

[Stackblitz Example](https://stackblitz.com/edit/stackblitz-starters-bsrgez?file=src%2Fmain.ts)

## Query Client

Inject the `QueryClient` [instance](https://tanstack.com/query/v5/docs/reference/QueryClient) through the `injectQueryClient()`
function.

```ts
import { injectQueryClient } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class TodosService {
  #queryClient = injectQueryClient();
}
```

> The function should run inside an injection context

### Query

Use the `injectQuery` function. Using this function is similar to the [official](https://tanstack.com/query/v5/docs/guides/queries) function.

```ts
import { injectQuery } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class TodosService {
  #http = inject(HttpClient);
  #query = injectQuery();

  getTodos() {
    return this.#query({
      queryKey: ['todos'] as const,
      queryFn: () => {
        return this.http.get<Todo[]>(
          'https://jsonplaceholder.typicode.com/todos',
        );
      },
    });
  }
}
```

> The function should run inside an injection context

#### Component Usage - Observable

To get an observable use the `result$` property:

```ts
@Component({
  standalone: true,
  template: `
    @if (todos.result$ | async; as result) {
      @if (result.isLoading) {
        <p>Loading</p>
      }
      @if (result.isSuccess) {
        <p>{{ result.data[0].title }}</p>
      }
      @if (result.isError) {
        <p>Error</p>
      }
    }
  `,
})
export class TodosPageComponent {
  todos = inject(TodosService).getTodos();
}
```

#### Component Usage - Signal

To get a signal use the `result` property:

```ts
@Component({
  standalone: true,
  template: `
    @if (todos().isLoading) {
      Loading
    }
    @if (todos().data; as data) {
      <p>{{ data[0].title }}</p>
    }
    @if (todos().isError) {
      <p>Error</p>
    }
  `,
})
export class TodosPageComponent {
  todos = inject(TodosService).getTodos().result;
}
```

## Typing Query Options

If you inline query options into `query`, you'll get automatic type inference. However, you might want to extract the query options into a separate function to share them between `query` and e.g. `prefetchQuery`. In that case, you'd lose type inference. To get it back, you can use `queryOptions` helper:

```ts
import { queryOptions } from '@ngneat/query';

function groupOptions() {
  return queryOptions({
    queryKey: ['groups'] as const,
    queryFn: fetchGroups,
    staleTime: 5 * 1000,
  });
}
```

Further, the `queryKey` returned from `queryOptions` knows about the `queryFn` associated with it, and we can leverage that type information to make functions like `queryClient.getQueryData` aware of those types as well:

```ts
@Injectable({ providedIn: 'root' })
export class GroupsService {
  #client = injectQueryClient();
  #http = inject(HttpClient);

  groupOptions = queryOptions({
    queryKey: ['groups'] as const,
    queryFn: () => this.http.get(url),
    staleTime: 5 * 1000,
  });

  getCachedGroup() {
    const data = this.#client.getQueryData(this.groupOptions.queryKey);
    //     ^? const data: Group[] | undefined
    return data;
  }
}
```

### Infinite Query

Use the `injectInfiniteQuery` function. Using this function is similar to the [official](https://tanstack.com/query/v5/docs/guides/infinite-queries) function.

```ts
import { injectInfiniteQuery } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class PostsService {
  #query = injectInfiniteQuery();

  getPosts() {
    return this.#query({
      queryKey: ['posts'],
      queryFn: ({ pageParam }) => getProjects(pageParam),
      initialPageParam: 0,
      getPreviousPageParam: (firstPage) => firstPage.previousId,
      getNextPageParam: (lastPage) => lastPage.nextId,
    });
  }
}
```

> The function should run inside an injection context

## Mutation

Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, The library exports the `injectMutation`` function.

```ts
import { injectMutation } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class TodosService {
  #mutation = injectMutation();
  #httpClient = inject(HttpClient);

  addTodo() {
    return this.#mutation({
      mutationFn: ({ title }) =>
        this.http.post<Todo>(`https://jsonplaceholder.typicode.com/todos`, {
          title,
        }),
    });
  }
}
```

The `variables` in the `mutationFn` callback are the variables that will be passed to the `mutate` function later.

Now create your component in which you want to use your newly created service:

```ts
@Component({
  template: `
    <input #ref />
    <button (click)="onAddTodo({ title: ref.value })">Add todo</button>

    @if (addTodo.result$ | async; as result) {
      @if (result.isLoading) {
        <p>Mutation is loading</p>
      }
      @if (result.isSuccess) {
        <p>Mutation was successful</p>
      }
      @if (result.isError) {
        <p>Mutation encountered an Error</p>
      }
    }
  `,
})
export class TodosComponent {
  addTodo = inject(TodosService).addTodo();

  onAddTodo({ title }) {
    this.addTodo.mutate({ title });
    // Or
    this.addTodo.mutateAsync({ title });
  }
}
```

If you prefer a signal based approach, then you can use the `result` getter function on `addTodo`.

```ts
@Component({
  template: `
    <input #ref />
    <button (click)="onAddTodo({ title: ref.value })">Add todo</button>

    @if (addTodo.result(); as result) {
      @if (result.isLoading) {
        <p>Mutation is loading</p>
      }
      @if (result.isSuccess) {
        <p>Mutation was successful</p>
      }
      @if (result.isError) {
        <p>Mutation encountered an Error</p>
      }
    }
  `,
})
export class TodosComponent {
  addTodo = inject(TodosService).addTodo();

  onAddTodo({ title }) {
    this.addTodo.mutate({ title });
  }
}
```

A more in depth [example](https://github.com/ngneat/query/blob/next/src/app/mutation-page/) can be found on our playground.

## Query Global Options

You can inject a default config for the underlying `@tanstack/query` instance by using the `provideQueryClientOptions({})` function.

```ts
import { provideQueryClientOptions } from '@ngneat/query';

bootstrapApplication(AppComponent, {
  providers: [
    provideQueryClientOptions({
      defaultOptions: {
        queries: {
          staleTime: 3000,
        },
      },
    }),
  ],
});
```

## Signal Utils

### intersectResults

The `intersectResults` function is used to merge multiple **_signal_** queries into one.
It will return a new base query result that will merge the results of all the queries.

> **Note:** The data will only be mapped if the result is **successful** and otherwise just returned as is on **any other** state.

```ts
import { intersectResults } from '@ngneat/query';

@Component({
  standalone: true,
  template: `
    <h1>Signals Intersection</h1>
    @if (intersection(); as intersectionResult) {
      @if (intersectionResult.isLoading) {
        <p>Loading</p>
      }
      @if (intersectionResult.isSuccess) {
        <p>{{ intersectionResult.data }}</p>
      }
      @if (intersectionResult.isError) {
        <p>Error</p>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosPageComponent {
  #todosService = inject(TodosService);

  intersection = intersectResults(
    [
      this.#todosService.getTodo('1').result,
      this.#todosService.getTodo('2').result,
    ],
    ([todoOne, todoTwo]) => todoOne.title + todoTwo.title,
  );

  intersectionAsObject = intersectResults(
    {
      todoOne: this.#todosService.getTodo('1').result,
      todoTwo: this.#todosService.getTodo('2').result,
    },
    ({ todoOne, todoTwo }) => todoOne.title + todoTwo.title,
  );
}
```

## RxJS Operators

### filterSuccessResult

The `filterSuccess` operator is useful when you want to filter only successful results:

`todosService.getTodos().result$.pipe(filterSuccess())`

### filterErrorResult

The `filterError` operator is useful when you want to filter only error results:

`todosService.getTodos().result$.pipe(filterError())`

### tapSuccessResult

The `tapSuccess` operator is useful when you want to run a side effect only when the result is successful:

`todosService.getTodos().result$.pipe(tapSuccess(console.log))`

### tapErrorResult

The `tapErrorResult` operator is useful when you want to run a side effect only when the result is successful:

`todosService.getTodos().result$.pipe(tapError(console.log))`

### mapResultData

The `mapResultData` operator maps the `data` property of the `result` object in case of a successful result.

```ts
this.todosService.getTodos().result$.pipe(
  mapResultData((data) => {
    return {
      todos: data.todos.filter(predicate),
    };
  }),
);
```

### takeUntilResultFinalize

An operator that takes values emitted by the source observable until the `isFetching` property on the result is false.  
It is intended to be used in scenarios where an observable stream should be listened to until the result has finished fetching (e.g success or error).

`todosService.getTodos().result$.pipe(takeUntilResultFinalize())`

### takeUntilResultSuccess

An operator that takes values emitted by the source observable until the `isSuccess` property on the result is true.  
It is intended to be used in scenarios where an observable stream should be listened to until a successful result is emitted.

`todosService.getTodos().result$.pipe(takeUntilResultSuccess())`

### takeUntilResultError()

An operator that takes values emitted by the source observable until the `isError` property on the result is true.  
It is intended to be used in scenarios where an observable stream should be listened to until an error result is emitted.

`todosService.getTodos().result$.pipe(takeUntilResultSuccess())`

### startWithPendingQueryResult

Starts the observable stream with a pending query result that would also be returned upon creating a normal query:

```ts
this.todosService.getTodos().result$.pipe(
  filterSuccess(),
  switchMap(() => someSource),
  startWithPendingQueryResult(),
);
```

### intersectResults$

The `intersectResults$` operator is used to merge multiple **_observable_** queries into one, this is usually done with a `combineLatest`.
It will return a new base query result that will merge the results of all the queries.

> **Note:** The data will only be mapped if the result is **successful** and otherwise just returned as is on **any other** state.

```ts
const query = combineLatest({
  todos: todos.result$,
  posts: posts.result$,
}).pipe(
  intersectResults$(({ todos, posts }) => { ... })
)

const query = combineLatest([todos.result$, posts.result$]).pipe(
  intersectResults$(([todos, posts]) => { ... })
)
```

## Utils

- `createSuccessObserverResult` - Create success observer result:

```
import { createSyncObserverResult } from '@ngneat/query';

result = of(createSuccessObserverResult(data))
```

- `createPendingObserverResult` - Create pending observer result

## Type Utils

- `ObservableQueryResult` - Alias for `Observable<QueryObserverResult<Data, Error>>`
- `SignalQueryResult` - Alias for `Signal<QueryObserverResult<Data, Error>>`

## Is Fetching

`injectIsFetching` is a function that returns the number of the queries that your application is loading or fetching in the background (useful for app-wide loading indicators).

### Observable Example

```ts
import { injectIsFetching } from '@ngneat/query';

class TodoComponent {
  #isFetching = injectIsFetching();
  // How many queries overall are currently fetching data?
  public isFetching$ = this.isFetching().result$;

  // How many queries matching the todos prefix are currently fetching?
  public isFetchingTodos$ = this.#isFetching({ queryKey: ['todos'] }).result$;
}
```

### Signal Example

```ts
import { injectIsFetching } from '@ngneat/query';

class TodoComponent {
  #isFetching = injectIsFetching();
  // How many queries overall are currently fetching data?
  public isFetching = this.#isFetching().result;

  // How many queries matching the todos prefix are currently fetching?
  public isFetchingTodos = this.#isFetching({
    queryKey: ['todos'],
  }).result;
}
```

## Is Mutating

`injectIsMutating` is an optional hook that returns the number of mutations that your application is fetching (useful for app-wide loading indicators).

### Observable Example

```ts
import { injectIsMutating } from '@ngneat/query';

class TodoComponent {
  #isMutating = injectIsMutating();
  // How many queries overall are currently fetching data?
  public isFetching$ = this.#isMutating().result$;

  // How many queries matching the todos prefix are currently fetching?
  public isFetchingTodos$ = this.#isMutating({ queryKey: ['todos'] }).result$;
}
```

### Signal Example

```ts
import { injectIsMutating } from '@ngneat/query';

class TodoComponent {
  #isMutating = injectIsMutating();
  // How many queries overall are currently fetching data?
  public isFetching = this.#isMutating().result;

  // How many queries matching the todos prefix are currently fetching?
  public isFetchingTodos = this.#isMutating({
    queryKey: ['todos'],
  }).result;
}
```

## Devtools

Install the `@ngneat/query-devtools` package. Lazy load and use it only in `development` environment:

```ts
import { provideQueryDevTools } from '@ngneat/query-devtools';
import { environment } from 'src/environments/environment';

bootstrapApplication(AppComponent, {
  providers: [environment.production ? [] : provideQueryDevTools(options)],
});
```

See all the avilable options [here](https://tanstack.com/query/v5/docs/react/devtools#options).

## SSR

On the Server:

```ts
import { provideQueryClient } from '@ngneat/query';
import { QueryClient, dehydrate } from '@tanstack/query-core';
import { renderApplication } from '@angular/platform-server';

async function handleRequest(req, res) {
  const queryClient = new QueryClient();
  let html = await renderApplication(AppComponent, {
    providers: [provideQueryClient(queryClient)],
  });

  const queryState = JSON.stringify(dehydrate(queryClient));
  html = html.replace(
    '</body>',
    `<script>window.__QUERY_STATE__ = ${queryState}</script></body>`,
  );

  res.send(html);
  queryClient.clear();
}
```

Client:

```ts
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideQueryClient } from '@ngneat/query';
import { QueryClient, hydrate } from '@tanstack/query-core';

const queryClient = new QueryClient();
const dehydratedState = JSON.parse(window.__QUERY_STATE__);
hydrate(queryClient, dehydratedState);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule.withServerTransition({ appId: 'server-app' }),
    ),
    provideQueryClient(queryClient),
  ],
});
```

## Injection Context

The `queryFn` run inside an injection context so we can do the following if we want:

```ts
import { injectQuery } from '@ngneat/query';

export function getTodos() {
  const query = injectQuery();

  return query({
    queryKey: ['todos'] as const,
    queryFn: () => {
      return inject(HttpClient).get<Todo[]>(
        'https://jsonplaceholder.typicode.com/todos',
      );
    },
  });
}
```

We can also pass a custom injector:

```ts
export function getTodos({ injector }: { injector: Injector }) {
  const query = injectQuery({ injector });

  return query({
    queryKey: ['todos'] as const,
    injector,
    queryFn: ({ signal }) => {
      return inject(HttpClient).get<Todo[]>(
        'https://jsonplaceholder.typicode.com/todos',
      );
    },
  });
}
```

## Created By

<table>
  <tr>
    <td align="center"><a href="https://www.netbasal.com"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4" width="100px;" alt="Netanel Basal"/><br /><sub><b>Netanel Basal</b></sub></a><br /></td>
    </tr>
</table>

## Contributors ✨

<table>
  <tr>
    <td align="center"><a href="https://github.com/luii"><img src="https://avatars.githubusercontent.com/u/8077014?v=4" width="100px;" alt="Netanel Basal"/><br /><sub><b>Philipp Czarnetzki</b></sub></a><br /></td>
    </tr>
</table>

Thank goes to all these wonderful [people who contributed](https://github.com/ngneat/query/graphs/contributors) ❤️
