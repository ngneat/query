> The TanStack Query (also known as react-query) adapter for Angular applications

Get rid of granular state management, manual refetching, and async spaghetti code. TanStack Query gives you declarative, always-up-to-date auto-managed queries and mutations that improve your developer experience.

## Features

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

[![Build Status](https://github.com/ngneat/query/actions/workflows/ci.yml/badge.svg)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![coc-badge](https://img.shields.io/badge/codeof-conduct-ff69b4.svg?style=flat-square)]()
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e5079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)](https://github.com/ngneat/spectator)

## Table of Contents

- [Features](#features)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Queries](#queries)
- [Query Client](#query-client)
  - [Query](#query)
  - [Infinite Query](#infinite-query)
  - [Persisted Query](#persisted-query)
- [Mutation](#mutation)
  - [Example](#example-mutation-example)
    - [Service](#mutation-service)
    - [Observable Component](#observable-mutation-component)
    - [Signal Component](#signal-mutation-component)
- [Query Global Options](#query-global-options)
- [Operators](#rxjs-operators)
- [Is Fetching](#isfetching)
- [Is Mutating](#ismutating)
- [Use Constructor DI](#use-constructor-di)
- [Devtools](#devtools)
- [SSR](#ssr)
- [Created By](#created-by)
- [Contributors ✨](#contributors-)

## Installation

npm
```
npm i -S @ngneat/query
```

Yarn
```
yarn add --save @ngneat/query
```

## Queries

## Query Client

Inject the `QueryClient` [instance](https://tanstack.com/query/v4/docs/reference/QueryClient) through the `injectQueryClient()`
function.

```ts
import { injectQueryClient } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class TodosService {
  private queryClient = injectQueryClient();
}
```

### Query

Inject the `UseQuery` in your service. Using the hook is similar to the [official](https://tanstack.com/query/v4/docs/guides/queries) hook, except the query function should return an `observable`.

```ts
import { UseQuery } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class TodosService {
  private http = inject(HttpClient);
  private useQuery = inject(UseQuery);

  getTodos() {
    return this.useQuery(['todos'], () => {
      return this.http.get<Todo[]>(
        'https://jsonplaceholder.typicode.com/todos'
      );
    });
  }

  getTodo(id: number) {
    return this.useQuery(['todo', id], () => {
      return this.http.get<Todo>(
        `https://jsonplaceholder.typicode.com/todos/${id}`
      );
    });
  }
}
```

Use it in your component:

```ts
import { SubscribeModule } from '@ngneat/subscribe';

@Component({
  standalone: true,
  imports: [NgIf, NgForOf, SpinnerComponent, SubscribeModule],
  template: `
    <ng-container *subscribe="todos$ as todos">
      <ng-query-spinner *ngIf="todos.isLoading"></ng-query-spinner>

      <p *ngIf="todos.isError">Error...</p>

      <ul *ngIf="todos.isSuccess">
        <li *ngFor="let todo of todos.data">
          {{ todo.title }}
        </li>
      </ul>
    </ng-container>
  `,
})
export class TodosPageComponent {
  todos$ = inject(TodosService).getTodos().result$;
}
```

Note that using the `*subscribe` [directive](https://github.com/ngneat/subscribe) is optional. Subscriptions can be made using any method you choose.

### Infinite Query

Inject the `UseInfiniteQuery` provider in your service. Using the hook is similar to the [official](https://tanstack.com/query/v4/docs/guides/infinite-queries) hook, except the query function should return an `observable`.

```ts
import { UseInfiniteQuery } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private useInfiniteQuery = inject(UseInfiniteQuery);

  getProjects() {
    return this.useInfiniteQuery(
      ['projects'],
      ({ pageParam = 0 }) => {
        return getProjects(pageParam);
      },
      {
        getNextPageParam(projects) {
          return projects.nextId;
        },
        getPreviousPageParam(projects) {
          return projects.previousId;
        },
      }
    );
  }
}
```

Checkout the complete [example](https://github.com/ngneat/query/blob/main/packages/playground/src/app/infinite-query-page/infinite-query-page.component.ts) in our playground.

## Mutation

In contrast to queries which are generally used for retrieving data, mutations are commonly
used for creating, updating, or deleting data or executing server-side effects.

To facilitate this, `@ngneat/query` has an injectable which achieves that.  
The most basic mutation consists of either a `mutationFn` or `mutationKey`, if only the latter was provided,
the query client will look for a mutation with the same `mutationKey` or take the default mutation function provided
by the `provideQueryClientOptions()` provider.

### Example <a name="mutation-example"></a>

> **Note:** It's generally recommended to keep shared functions, like this is one, though not required, in a shared service

To get started with a basic mutation, first create a service like this:

<a id="mutation-service"></a>
```ts
@Injectable({ providedIn: 'root' })
export class TodosService {
  #useMutation = injectMutation();
  #httpClient = inject(HttpClient);
  
  addTodo() {
    return this.#useMutation({
      mutationFn: ({ title }) => this.http.post<Todo>('...', { title })
    });
  }
}
```

The `variables` in the `mutationFn` callback are the variables that will be passed to the `mutate({ title: 'Example' })` function later.  

Now create your component in which you want to use your newly created service:

<a id="observable-mutation-component"></a>
```ts
@Component({
  template: `
    <input #ref />
    <button (click)="onAddTodo({ title: ref.value })">Add todo</button>
    
    @if(addTodo.result$ | async; as result) {
      @if(result.isLoading) {
        <p>Mutation is loading</p> 
      }
      @if(result.isSuccess) {
        <p>Mutation was successful</p> 
      }
      @if(result.isError) {
        <p>Mutation encountered an Error</p>
      }
    }
  `,
})
export class TodosComponent {
  #todosService = inject(TodosService);
  addTodo = this.#todoService.addTodo();

  onAddTodo({ title }) {
    this.addTodo.mutate({ title });
  }
}
```

If you prefer a signal based approach, then you can use the `result` getter function on `addTodo`.

<a id="signal-mutation-component"></a>
```ts
@Component({
  template: `
    <input #ref />
    <button (click)="onAddTodo({ title: ref.value })">Add todo</button>
    
    @if(addTodo.result(); as result) {
      @if(result.isLoading) {
        <p>Mutation is loading</p> 
      }
      @if(result.isSuccess) {
        <p>Mutation was successful</p> 
      }
      @if(result.isError) {
        <p>Mutation encountered an Error</p>
      }
    }
  `,
})
export class TodosComponent {
  #todosService = inject(TodosService);
  addTodo = this.#todoService.addTodo();

  onAddTodo({ title }) {
    this.addTodo.mutate({ title });
  }
}
```

A more in depth [Example](https://github.com/ngneat/query/blob/next/src/app/mutation-page/) can be found on our playground.

## Query Global Options

You can inject a default config for the underlying `@tanstack/query` instance by adding `provideQueryClientOptions({})` in an `EnvironmentInjectorContext`
or `ComponentInjectorContext`.

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
  ]
});
```

## RxJS Operators

### [filterSuccessResult()](https://github.com/ngneat/query/blob/6bb064afe53e6636b72f3556ee3ff304d727e94d/query/src/lib/operators.ts#L22)

The `filterSuccess` operator is a shortcut for `filter((result) => result.isSuccess)`. 
It's useful when you want to filter only successful results.

#### Example 

```ts
this.todosService.getTodos().result$.pipe(filterSuccess());
```

### [filterErrorResult()](https://github.com/ngneat/query/blob/6bb064afe53e6636b72f3556ee3ff304d727e94d/query/src/lib/operators.ts#L31)

The `filterError` operator is a shortcut for `filter((result) => result.status === 'error')`.
It's useful when you want to filter only error results.

#### Example

```ts
this.todosService.getTodos().result$.pipe(filterError()); 
```

### [tapSuccessResult(callback: (data) => void)](https://github.com/ngneat/query/blob/6bb064afe53e6636b72f3556ee3ff304d727e94d/query/src/lib/operators.ts#L41)

The `tapSuccess` operator is a shortcut for `tap((result) => result.isSuccess && callback(result.data))`. 
It's useful when you want to run a side effect only when the result is successful.

#### Example

```ts
this.todosService.getTodos().result$.pipe(tapSuccess((data) => console.log(data)));
```

### [tapErrorResult(callback: (error) => void)](https://github.com/ngneat/query/blob/6bb064afe53e6636b72f3556ee3ff304d727e94d/query/src/lib/operators.ts#L51)

The `tapError` operator is a shortcut for `tap((result) => result.isError && callback(result.error))`.
It's useful when you want to run a side effect only when the result is successful.

#### Example

```ts
this.todosService.getTodos().result$.pipe(tapError((error) => console.log(error)));
```

### [mapResultData(mapFn)](https://github.com/ngneat/query/blob/6bb064afe53e6636b72f3556ee3ff304d727e94d/query/src/lib/operators.ts#L9)

The `mapResultData` operator like the name implies maps the `data` property of the `result` object.
> **Note:** The data will only be mapped if the result is **successful** and otherwise just returned as is on **any other** state.

#### Example

```ts
this.todosService.getTodos().pipe(
  mapResultData((data) => {
    return {
      todos: data.todos.filter(predicate),
    };
  })
);
```

### [takeUntilResultFinalize() ](https://github.com/ngneat/query/blob/6bb064afe53e6636b72f3556ee3ff304d727e94d/query/src/lib/operators.ts#L67)

An operator that takes values emitted by the source observable until the `isFetching` property on the result is false.  
It is intended to be used in scenarios where an observable stream should be listened to until the result has finished fetching (e.g success or error).

#### Example

```ts
this.todosService.getTodos().pipe(
  takeUntilResultFinalize()
);
```

### [takeUntilResultSuccess()](https://github.com/ngneat/query/blob/6bb064afe53e6636b72f3556ee3ff304d727e94d/query/src/lib/operators.ts#L77)

An operator that takes values emitted by the source observable until the `isSuccess` property on the result is true.  
It is intended to be used in scenarios where an observable stream should be listened to until a successful result is emitted.

#### Example

```ts
this.todosService.getTodos().pipe(
  takeUntilResultSuccess()
);
```

### [takeUntilResultError()](https://github.com/ngneat/query/blob/6bb064afe53e6636b72f3556ee3ff304d727e94d/query/src/lib/operators.ts#L87)

An operator that takes values emitted by the source observable until the `isError` property on the result is true.  
It is intended to be used in scenarios where an observable stream should be listened to until an error result is emitted.

#### Example

```ts
this.todosService.getTodos().pipe(
  takeUntilResultSuccess()
);
```

### [startWithQueryResult()](https://github.com/ngneat/query/blob/6bb064afe53e6636b72f3556ee3ff304d727e94d/query/src/lib/operators.ts#L91)

Starts the observable stream with an standard query result that would also be returned upon creating a normal query.  
This is a shortcut for: `startWith({isError: false, isLoading: true, isPending: true, isFetching: true, isSuccess: false, fetchStatus: 'fetching', status: 'pending' } as QueryObserverBaseResult<T>);`

#### Example

```ts
this.todosService.getTodos().pipe(
  startWithQueryResult()
);
```

### [intersectResults$<T, R>(mapFn: (combinedQueries) => QueryObserverResult<R> & { all: T })](https://github.com/ngneat/query/blob/6bb064afe53e6636b72f3556ee3ff304d727e94d/query/src/lib/operators.ts#L143)

The `intersectResults$` operator is used to merge multiple ___observable___ queries into one, this is usually done with a `combineLatest`.
It will return a new base query result that will merge the results of all the queries.

> **Note:** This Operator is not limited to `combineLatest`, any combinator operator that produces a object/array like shown below could be used instead.

> **Note:** The data will only be mapped if the result is **successful** and otherwise just returned as is on **any other** state.

#### Example

##### Object
```ts
const query = combineLatest({
  todos: todos.result$,
  posts: posts.result$,
}).pipe(
  intersectResults$(({ todos, posts }) => { ... })
)
```
##### Array
```ts
const query = combineLatest([todos.result$, posts.result$]).pipe(
  intersectResults$(([todos, posts]) => { ... })
)
```

## Is Fetching

`isFetching` is an optional injectable that returns the number of the queries that your application is loading or fetching 
in the background (could be used for app-wide loading indicators). You can either get them as observable stream by
calling `result$` or as signal by calling `toSignal()` on it, like shown below.

### Observable Example

```ts
import { injectIsFetching } from '@ngneat/query';

class TodoComponent {
  #useIsFetching = injectIsFetching();
  // How many queries overall are currently fetching data?
  public isFetching$ = this.#useIsFetching().result$;
  
  // How many queries matching the todos prefix are currently fetching?
  public isFetchingTodos$ = this.#useIsFetching({ queryKey: ['todos'] }).result$; 
}
```

### Signal Example

```ts
import { injectIsFetching } from '@ngneat/query';

class TodoComponent {
  #useIsFetching = injectIsFetching();
  // How many queries overall are currently fetching data?
  public isFetching = this.#useIsFetching().toSignal();
  
  // How many queries matching the todos prefix are currently fetching?
  public isFetchingTodos = this.#useIsFetching({ queryKey: ['todos'] }).toSignal();
}
```

## Is Mutating

`isMutating` is an optional injectable that returns the number of the mutations that your application is fetching
in the background (could be used for app-wide loading indicators). You can either receive the result as observable
through calling `result$` or as signal by calling `toSignal()` on it, like shown below.

### Observable Example

```ts
import { injectIsMutating } from '@ngneat/query';

class TodoComponent {
  #useIsMutating = injectIsMutating();
  // How many queries overall are currently fetching data?
  public isFetching$ = this.#useIsMutating().result$;
  
  // How many queries matching the todos prefix are currently fetching?
  public isFetchingTodos$ = this.#useIsMutating({ queryKey: ['todos'] }).result$; 
}
```

### Signal Example

```ts
import { injectIsFetching } from '@ngneat/query';

class TodoComponent {
  #useIsMutating = injectIsMutating();
  // How many queries overall are currently fetching data?
  public isFetching = this.#useIsMutating().toSignal();
  
  // How many queries matching the todos prefix are currently fetching?
  public isFetchingTodos = this.#useIsMutating({ queryKey: ['todos'] }).toSignal();
}
```

## Devtools

Install the `@ngneat/query-devtools` package. Lazy load and use it only in `development` environment:

```ts
import { provideQueryDevTools } from '@ngneat/query';

bootstrapApplication(AppComponent, {
  providers: [
    provideQueryDevTools(),
  ],
});
```

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
    `<script>window.__QUERY_STATE__ = ${queryState}</script></body>`
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
      BrowserModule.withServerTransition({ appId: 'server-app' })
    ),
    provideQueryClient(queryClient),
  ],
});
```

## Created By

<table>
  <tr>
    <td align="center"><a href="https://www.netbasal.com"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4" width="100px;" alt="Netanel Basal"/><br /><sub><b>Netanel Basal</b></sub></a><br /></td>
    </tr>
</table>

## Contributors ✨

Thank goes to all these wonderful [people who contributed](https://github.com/ngneat/query/graphs/contributors) ❤️
