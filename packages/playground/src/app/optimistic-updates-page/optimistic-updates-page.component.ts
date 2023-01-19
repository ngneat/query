import { HttpClient } from '@angular/common/http';
import { QueryClientService, UseMutation } from '@ngneat/query';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SubscribeModule } from '@ngneat/subscribe';
import { SpinnerComponent } from '../spinner/spinner.component';
import { TodosService } from '../todos.service';
import { map, tap } from 'rxjs';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'ng-query-optimistic-updates',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    JsonPipe,
    SubscribeModule,
    SpinnerComponent,
    FormsModule,
  ],
  template: `
    <div>
      <form class="flex gap-4" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-1"
            for="username"
          >
            Title
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [(ngModel)]="title"
            name="first"
          />
        </div>
        <button
          type="button"
          class="btn btn-info self-center"
          [disabled]="!title"
        >
          add todo
        </button>
      </form>
      <ng-container *subscribe="todos$ as todos">
        <ng-query-spinner *ngIf="todos.isLoading"></ng-query-spinner>

        <ul class="list-group" *ngIf="todos.isSuccess">
          <li class="list-group-item" *ngFor="let todo of todos.data">
            {{ todo.title }}
          </li>
        </ul>
      </ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptimisticUpdatesPageComponent {
  private todosService = inject(TodosService);
  private useMutation = inject(UseMutation);
  private queryClient = inject(QueryClientService);
  private http = inject(HttpClient);
  title = '';

  todos$ = this.todosService.getTodos().result$.pipe(
    map((result) => ({
      ...result,
      data: result.data?.slice(result.data.length - 10),
    }))
  );

  onSubmit() {
    if (this.title) this.addTodo().mutate();
  }

  addTodo() {
    const { title } = this;
    return this.useMutation(() => this.mutationFn({ title }), {
      onMutate: () => this.onMutate({ title }),
    });
  }

  /* 
    this mutation Function is not invalidate the query because it would replace the optimistic update 
    by outdated data since it is using jsonplacehoder and it would not persist the newly created todo.
  */
  mutationFn({ title }: { title: string }) {
    return this.http.post<Todo>(`https://jsonplaceholder.typicode.com/todos`, {
      title,
    });
  }

  /* 
    In a real world scenario it would be recommended to invalidate the query so that it gets fresh data from data sources.
    this method could replace mutationFn.
  */
  mutationFnWithQueryInvalidation({ title }: { title: string }) {
    return this.http
      .post<Todo>(`https://jsonplaceholder.typicode.com/todos`, {
        title,
      })
      .pipe(
        tap(() => {
          this.queryClient.invalidateQueries(['todos']);
        })
      );
  }

  async onMutate({ title }: { title: string }) {
    const newTodo: Todo = { id: Math.random(), title, completed: false };

    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await this.queryClient.cancelQueries({ queryKey: ['todos'] });

    // Snapshot the previous value
    const todos = this.queryClient.getQueryData<Todo[]>(['todos']);

    // const newTodo: Todo = { id: Math.random(), title, completed: false };
    // Optimistically update to the new value
    if (todos) {
      this.queryClient.setQueryData<Todo[]>(['todos'], [...todos, newTodo]);
    }

    return { todos };
  }
}
