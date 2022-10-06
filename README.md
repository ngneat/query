# WIP

### You're welcome to contribute!

Learning resources:

- https://github.com/TanStack/query/tree/d018dfa46083ce059e0aadc06b48f729faade825/packages/react-query/src
- https://tanstack.com/query/v4/docs/overview
- https://github.com/TanStack/query/tree/d018dfa46083ce059e0aadc06b48f729faade825/packages/query-core/src/tests

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryProvider } from '@ngneat/ng-query';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

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
