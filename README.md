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
- [Mutations](#mutations)
  - [Mutation Result](#mutation-result)
  - [Mutation](#mutation)
- [Query Global Options](#query-global-options)
- [Operators](#operators)
- [Utils](#utils)
- [Use Constructor DI](#use-constructor-di)
- [Devtools](#devtools)
- [SSR](#ssr)
- [Created By](#created-by)
- [Contributors ✨](#contributors-)

## Installation

```
npm i @ngneat/query
yarn add @ngneat/query
```

## Queries

## Query Client

Inject the `QueryClientService` provider to get access to the query client [instance](https://tanstack.com/query/v4/docs/reference/QueryClient):

```ts
import { QueryClientService } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class TodosService {
  private queryClient = inject(QueryClientService);
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
    return this.useQuery({
      queryKey: ['todos'],
      queryFn: this.http.get<Todo[]>(
        'https://jsonplaceholder.typicode.com/todos'
      )
    });
  }

  getTodo(id: number) {
    return this.useQuery({
      queryKey: ['todo', id],
      queryFn: () => this.http.get<Todo>(
        `https://jsonplaceholder.typicode.com/todos/${id}`
      )
    });
  }
}
```

Use it in your component:

```ts
@Component({
  standalone: true,
  imports: [NgIf, NgForOf, AsyncPipe, SpinnerComponent],
  template: `
    <ng-container *ngIf="todos$ | async as todos">
      <ng-query-spinner *ngIf="todos.isPending"></ng-query-spinner>

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
    return this.useInfiniteQuery({
      queryKey: ['projects'],
      queryFn: ({ pageParam = 0 }) => {
        return getProjects(pageParam);
      },
      getNextPageParam: (projects) => projects.nextId,
      getPreviousPageParam: (projects) => projects.previousId
    });
  }
}
```

Checkout the complete [example](https://github.com/ngneat/query/blob/main/packages/playground/src/app/infinite-query-page/infinite-query-page.component.ts) in our playground.

### Persisted Query

Use the `UsePersistedQuery` provider when you want to use the `keepPreviousData` feature. For example, to implement the [pagination](https://tanstack.com/query/v4/docs/guides/paginated-queries) functionality:

```ts
import { inject, Injectable } from '@angular/core';
import {
  UsePersistedQuery,
  QueryClientService,
  queryOptions,
} from '@ngneat/query';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private queryClient = inject(QueryClientService);

  getProjects = inject(UsePersistedQuery)((queryKey: ['projects', number]) => {
    return queryOptions({
      queryKey,
      queryFn: ({ queryKey }) => {
        return fetchProjects(queryKey[1]);
      },
    });
  });

  prefetch(page: number) {
    return this.queryClient.prefetchQuery(['projects', page], () =>
      firstValueFrom(fetchProjects(page))
    );
  }
}
```

Checkout the complete [example](https://github.com/ngneat/query/blob/main/packages/playground/src/app/pagination-page/pagination-page.component.ts) in our playground.

## Mutations

### Mutation Result

The official `mutation` function can be a little verbose. Generally, you can use the following in-house simplified implementation.

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryClientService } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class TodosService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClientService);

  addTodo({ title }: { title: string }) {
    return this.http.post<{ success: boolean }>(`todos`, { title }).pipe(
      tap((newTodo) => {
        // Invalidate to refetch
        this.queryClient.invalidateQueries(['todos']);
        // Or update manually
        this.queryClient.setQueryData<TodosResponse>(
          ['todos'],
          addEntity('todos', newTodo)
        );
      })
    );
  }
}
```

And in the component:

```ts
import { QueryClientService, useMutationResult } from '@ngneat/query';

@Component({
  template: `
    <input #ref />

    <button
      (click)="addTodo({ title: ref.value })"
      *ngIf="(addTodoMutation.result$ | async) as addTodoMutation"
    >
      Add todo {{ addTodoMutation.isLoading ? 'Loading' : '' }}
    </button>
  `,
})
export class TodosPageComponent {
  private todosService = inject(TodosService);
  addTodoMutation = useMutationResult();

  addTodo({ title }) {
    this.todosService
      .addTodo({ title })
      .pipe(this.addTodoMutation.track())
      .subscribe();
  }
}
```

### Mutation

You can use the original `mutation` [functionality](https://tanstack.com/query/v4/docs/reference/useMutation) if you prefer.

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryClientService, UseMutation } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class TodosService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClientService);
  private useMutation = inject(UseMutation);

  addTodo() {
    return this.useMutation(({ title }: { title: string }) => {
      return this.http.post<{ success: boolean }>(`todos`, { title }).pipe(
        tap((newTodo) => {
          // Invalidate to refetch
          this.queryClient.invalidateQueries(['todos']);
          // Or update manually
          this.queryClient.setQueryData<TodosResponse>(
            ['todos'],
            addEntity('todos', newTodo)
          );
        })
      );
    });
  }
}
```

And in the component:

```ts
@Component({
  template: `
    <input #ref />

    <button
      (click)="addTodo({ title: ref.value })"
      *ngIf="(addTodoMutation.result$ | async) as addTodoMutation"
    >
      Add todo {{ addTodoMutation.isLoading ? 'Loading' : '' }}
    </button>
  `,
})
export class TodosPageComponent {
  private todosService = inject(TodosService);
  addTodoMutation = this.todosService.addTodo();

  addTodo({ title }) {
    this.addTodoMutation$.mutate({ title }).then((res) => {
      console.log(res.success);
    });
  }
}
```

## Query Global Options

You can provide the `QUERY_CLIENT_OPTIONS` provider to set the global [options](https://tanstack.com/query/v4/docs/reference/QueryClient) of the query client instance:

```ts
import { provideQueryClientOptions } from '@ngneat/query';

{
  providers: [
    provideQueryClientOptions({
      defaultOptions: {
        queries: {
          staleTime: 3000,
        },
      },
    }),
  ];
}
```

## Operators

```ts
import {
  filterError,
  filterSuccess,
  selectResult,
  mapResultData,
  mapResultsData,
  tapSuccess,
  tapError,
  startWithQueryResult,
} from '@ngneat/query';

export class TodosPageComponent {
  public todos: Array<Todo>;
  todosService = inject(TodosService);

  ngOnInit() {
    this.todosService.getTodos().result$.pipe(filterError());
    this.todosService.getTodos().result$.pipe(filterSuccess());
    this.todosService
      .getTodos()
      .result$.pipe(selectResult((result) => result.data.foo));

    // Map the result `data`
    this.todosService.getTodos().pipe(
      mapResultData((data) => {
        return {
          todos: data.todos.filter(predicate),
        };
      })
    );
    
    // Map the result `data` of multiple queries
    combineLatest([
      this.todosService.getTodos(),
      this.todosService.getTodos(),
    ]).pipe(
      mapResultsData(([todos, todos2]) => {
        return {
          todos: todos.data.todos.filter(predicate),
          todos2: todos2.data.todos.filter(predicate),
        };
      })
    ).subscribe(console.log); // { isLoading: boolean, isSuccess: boolean, isError: boolean, error: unknown, data: { todos: [], todos2: [] } }

    // process error or success result directly
    this.todosService
      .getTodos()
      .result$.pipe(
        tapSuccess((data) => {
          // get result data directly if success
          this.todos = data;
        }),
        tapError((error) => {
          // do what you want with error (display modal, toast, etc)
          alert(error.message);
        })
      )
      .subscribe();
  }
}
```

## Utils

Implementation of [isFetching](https://tanstack.com/query/v4/docs/reference/useIsFetching) and [isMutating](https://tanstack.com/query/v4/docs/reference/useIsMutating).

```ts
import {
  UseIsFetching,
  UseIsMutating,
  createSyncObserverResult
} from '@ngneat/query';

// How many queries are fetching?
const isFetching$ = inject(UseIsFetching)();
// How many queries matching the posts prefix are fetching?
const isFetchingPosts$ = inject(UseIsFetching)(['posts']);

// How many mutations are fetching?
const isMutating$ = inject(UseIsMutating)();
// How many mutations matching the posts prefix are fetching?
const isMutatingPosts$ = inject(UseIsMutating)(['posts']);

// Create sync successful observer in case we want to work with one interface
of(createSyncObserverResult(data, options?))
```

## Use Constructor DI

You can use the `constructor` version instead of `inject`:

```ts
QueryService.use(...)
PersistedQueryService.use(...)
InfiniteQueryService.use(...)
MutationService.use(...)
```

## Devtools

Install the `@ngneat/query-devtools` package. Lazy load and use it only in `development` environment:

```ts
import { ENVIRONMENT_INITIALIZER } from '@angular/core';
import { environment } from './environments/environment';

import { QueryClientService } from '@ngneat/query';

bootstrapApplication(AppComponent, {
  providers: [
    environment.production
      ? []
      : {
          provide: ENVIRONMENT_INITIALIZER,
          multi: true,
          useValue() {
            const queryClient = inject(QueryClientService);
            import('@ngneat/query-devtools').then((m) => {
              m.ngQueryDevtools({ queryClient });
            });
          },
        },
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
