import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryProvider } from '@ngneat/ng-query';
import { withDelay } from './utils';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private http = inject(HttpClient);
  private useQuery = inject(QueryProvider);

  getTodos() {
    return this.useQuery(['todos'], () => {
      return this.http.get<Todo[]>(
        withDelay('https://jsonplaceholder.typicode.com/todos')
      );
    });
  }

  getTodo(id: number) {
    return this.useQuery(['todo', id], () => {
      return this.http.get<Todo>(
        withDelay(`https://jsonplaceholder.typicode.com/todos/${id}`)
      );
    });
  }
}
