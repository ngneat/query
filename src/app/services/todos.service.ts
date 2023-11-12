import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
  queryOptions,
  toPromise,
} from '@ngneat/query';

interface Todo {
  id: number;
  title: string;
}

export function getTodos({ injector }: { injector: Injector }) {
  const query = injectQuery({ injector });

  return query({
    queryKey: ['getTodos'] as const,
    injector,
    queryFn: ({ signal }) => {
      const source = inject(HttpClient).get<Todo[]>(
        'https://jsonplaceholder.typicode.com/todos',
      );

      return toPromise({ source, signal });
    },
  });
}

@Injectable({ providedIn: 'root' })
export class TodosService {
  #client = injectQueryClient();
  #query = injectQuery();
  #mutation = injectMutation();
  #http = inject(HttpClient);

  #getTodosOptions = queryOptions({
    queryKey: ['todos'] as const,
    queryFn: ({ signal }) => {
      const source = this.#http.get<Todo[]>(
        'https://jsonplaceholder.typicode.com/todos',
      );

      return toPromise({ source, signal });
    },
  });

  getTodos() {
    return this.#query(this.#getTodosOptions);
  }

  getCachedTodo(id: number) {
    const todos = this.#client.getQueryData(this.#getTodosOptions.queryKey);

    if (todos) {
      return todos.find((todo) => todo.id === id);
    }

    return null;
  }

  invalidateTodos() {
    this.#client.invalidateQueries({
      queryKey: this.#getTodosOptions.queryKey,
    });
  }

  getTodo(id: string) {
    return this.#query({
      queryKey: ['todos', id] as const,
      queryFn: ({ signal }) => {
        const source = this.#http.get<Todo>(
          `https://jsonplaceholder.typicode.com/todos/${id}`,
        );

        return toPromise({ source, signal });
      },
    });
  }

  addTodo() {
    return this.#mutation({
      onSuccess: () => this.#client.invalidateQueries({ queryKey: ['todos'] }),
      mutationFn: ({
        title,
        showError,
      }: {
        title: string;
        showError: boolean;
      }) => {
        const url = showError
          ? 'https://jsonplaceholder.typicode.com/error/404'
          : 'https://jsonplaceholder.typicode.com/todos';
        return this.#http.post<Todo>(url, {
          title,
        });
      },
    });
  }
}
