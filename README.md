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
[![Join the chat at https://gitter.im/ngneat-transloco](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/ngneat-transloco/lobby?source=orgpage)

## Table of Contents

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
- [Entity Utils](#utils)
- [Utils](#utils)
- [Devtools](#testing-directives)

## Installation

```
npm i @ngneat/query
yarn add @ngneat/query
```

## Queries

## Query Client

Inject the `QueryClient` provider to get access to the query client [instance](https://tanstack.com/query/v4/docs/reference/QueryClient):

```ts
@Injectable({ providedIn: 'root' })
export class TodosService {
  private queryClient = inject(QueryClient);
}
```

### Query

Inject the `QueryProvider` in your service. Using the hook is similar to the [official](https://tanstack.com/query/v4/docs/guides/queries) hook, except the query function should return an `observable`.

```ts
import { QueryProvider } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class TodosService {
  private http = inject(HttpClient);
  private useQuery = inject(QueryProvider);

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
  imports: [CommonModule, SpinnerComponent, SubscribeModule],
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

Note that using the `*subscribe` directive is optional. Subscriptions can be made using any method you choose.

### Infinite Query

Inject the `InfiniteQueryProvider` in your service. Using the hook is similar to the [official](https://tanstack.com/query/v4/docs/guides/infinite-queries) hook, except the query function should return an `observable`.

```ts
import { InfiniteQueryProvider } from '@ngneat/query';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private useInfiniteQuery = inject(InfiniteQueryProvider);

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

### Persisted Query

Use the `PersistedQueryProvider` when you want to use the `keepPreviousData` feature. For example, to implement the [pagination](https://tanstack.com/query/v4/docs/guides/paginated-queries) functionality:

```ts
import { inject, Injectable } from '@angular/core';
import {
  PersistedQueryProvider,
  QueryClient,
  queryOptions,
} from '@ngneat/query';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  private queryClient = inject(QueryClient);

  getProjects = inject(PersistedQueryProvider)(
    (queryKey: ['projects', number]) => {
      return queryOptions({
        queryKey,
        queryFn: ({ queryKey }) => {
          return fetchProjects(queryKey[1]);
        },
      });
    }
  );

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

### Mutation

## Query Global Options

You can provide the `QUERY_CLIENT_OPTIONS` provider to set the global [options](https://tanstack.com/query/v4/docs/reference/QueryClient) of the query client instance:

```ts
import { QUERY_CLIENT_OPTIONS } from '@ngneat/query';

{
  provide: QUERY_CLIENT_OPTIONS,
  useValue: {
    defaultOptions: {
      queries: {
        staleTime: 3000
      }
    }
  }
}
```

Note that the default `staleTime` of this library is `Infinity`.

## Operators

```ts
import { filterError, filterSuccess, selectResult } from '@ngneat/query';

export class TodosPageComponent {
  todosService = inject(TodosService);

  ngOnInit() {
    this.todosService.getTodos().result$.pipe(filterError());
    this.todosService.getTodos().result$.pipe(filterSuccess());
    this.todosService
      .getTodos()
      .result$.pipe(selectResult((result) => result.data.foo));
  }
}
```

## Entity Utils

```ts
import { addEntity, QueryClient, QueryProvider } from '@ngneat/query';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodosService {
  private useQuery = inject(QueryProvider);
  private queryClient = inject(QueryClient);
  private http = inject(HttpClient);

  createTodo(body) {
    return this.http.post('todos', body).pipe(
      tap((newTodo) => {
        this.queryClient.setQueryData<TodosResponse>(
          ['todos'],
          addEntity('todos', newTodo)
        );
      })
    );
  }
}
```

## Utils

Implementation of [isFetching](https://tanstack.com/query/v4/docs/reference/useIsFetching) and [isMutating](https://tanstack.com/query/v4/docs/reference/useIsMutating).

```ts
import { IsFetchingProvider, IsMutatingProvider } from '@ngneat/query';

// How many queries are fetching?
const isFetching$ = inject(IsFetchingProvider)();
// How many queries matching the posts prefix are fetching?
const isFetchingPosts$ = inject(IsFetchingProvider)(['posts']);

// How many mutations are fetching?
const isMutating$ = inject(IsMutatingProvider)();
// How many mutations matching the posts prefix are fetching?
const isMutatingPosts$ = inject(IsMutatingProvider)(['posts']);
```

## Devtools

## Created By

<table>
  <tr>
    <td align="center"><a href="https://www.netbasal.com"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4" width="100px;" alt="Netanel Basal"/><br /><sub><b>Netanel Basal</b></sub></a><br /></td>
    </tr>
</table>

## Contributors ✨

Thank goes to all these wonderful [people who contributed](https://github.com/ngneat/query/graphs/contributors) ❤️
