import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { injectMutation, injectQuery, toPromise } from '@ngneat/query';

interface Todo {
  id: number;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class TodosService {
  private query = injectQuery();
  private useMutation = injectMutation();
  private http = inject(HttpClient);

  getTodos() {
    return this.query({
      queryKey: ['todos'] as const,
      queryFn: ({ signal }) => {
        const source = this.http.get<Todo[]>(
          'https://jsonplaceholder.typicode.com/todos'
        );

        return toPromise({ source, signal });
      },
    });
  }

  addTodo() {
    return this.useMutation({
      mutationFn: ({title, showError}: {title: string, showError: boolean}) => {
        const url = showError ? 'https://jsonplaceholder.typicode.com/error/404' : 'https://jsonplaceholder.typicode.com/todos';
        return this.http.post<Todo>(url, {
          title,
        });
      }
    });
  }
}
