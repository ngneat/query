# WIP

### You're welcome to contribute!

Learning resources:

- https://github.com/TanStack/query/tree/d018dfa46083ce059e0aadc06b48f729faade825/packages/react-query/src
- https://tanstack.com/query/v4/docs/overview
- https://github.com/TanStack/query/tree/d018dfa46083ce059e0aadc06b48f729faade825/packages/query-core/src/tests

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MutationProvider, QueryClient, QueryProvider } from '@ngneat/query';
import { tap } from 'rxjs';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodosService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);
  private useQuery = inject(QueryProvider);
  private useMutation = inject(MutationProvider);

  getTodos() {
    return this.useQuery(['todos'], () => {
      return this.http.get<Todo[]>('http://localhost:3333/todos');
    });
  }

  addTodo() {
    return this.useMutation(({ title }: { title: string }) => {
      return this.http
        .post<{ success: boolean }>(`http://localhost:3333/todos`, { title })
        .pipe(
          tap(() => {
            this.queryClient.invalidateQueries(['todos']);
          })
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
