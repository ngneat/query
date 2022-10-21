import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { useMutationResult } from '@ngneat/query';
import { SubscribeModule } from '@ngneat/subscribe';
import { BehaviorSubject, switchMap } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { TodosService } from '../todos.service';

@Component({
  selector: 'ng-query-basic-page',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, SubscribeModule],
  template: `
    <h2 class="mb-3">Todos</h2>

    <div class="mb-3">
      <button
        (click)="addTodoBuiltIn()"
        id="add-todo-1"
        class="btn btn-info mt-2"
        *subscribe="addTodoMutation.result$ as addTodoMutation"
      >
        Add todo built in impl {{ addTodoMutation.isLoading ? 'Loading' : '' }}
      </button>

      <button
        (click)="addTodoOriginal()"
        id="add-todo-2"
        class="btn btn-info mt-2 ml-3"
        *subscribe="addTodoMutationOriginal.result$ as addTodoMutationOriginal"
      >
        Add todo original impl
        {{ addTodoMutationOriginal.isLoading ? 'Loading' : '' }}
      </button>
    </div>

    <ng-container *subscribe="todos$ as todos">
      <ng-query-spinner *ngIf="todos.isLoading"></ng-query-spinner>

      <ul class="list-group" *ngIf="todos.isSuccess">
        <li class="list-group-item" *ngFor="let todo of todos.data">
          {{ todo.title }}
        </li>
      </ul>
    </ng-container>

    <hr />
    <h2 class="mt-3">Single Todo</h2>

    <section id="todo-btns-section" class="flex gap-3 items-center">
      <button type="button" (click)="todo.next(100)" class="btn btn-info">
        Todo 100
      </button>
      <button type="button" (click)="todo.next(101)" class="btn btn-info">
        Todo 101
      </button>
      <button type="button" (click)="todo.next(102)" class="btn btn-info">
        Todo 102
      </button>
    </section>

    <ng-container *subscribe="todo$ as todo">
      <ng-query-spinner class="mt-3" *ngIf="todo.isLoading"></ng-query-spinner>

      <div class="card mt-3" id="single-todo-card" *ngIf="todo.isSuccess">
        <div class="card-body">{{ todo.data.id }} - {{ todo.data.title }}</div>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicPageComponent {
  private todosService = inject(TodosService);
  todo = new BehaviorSubject<number>(100);
  todos$ = this.todosService.getTodos().result$;
  todo$ = this.todo
    .asObservable()
    .pipe(switchMap((id) => this.todosService.getTodo(id).result$));

  addTodoMutationOriginal = this.todosService.addTodoOriginal();
  addTodoMutation = useMutationResult();

  addTodoOriginal() {
    this.addTodoMutationOriginal.mutate({ title: 'foo' }).then((res) => {
      console.log(res);
    });
  }

  addTodoBuiltIn() {
    this.todosService
      .addTodoBuiltIn({ title: 'foo' })
      .pipe(this.addTodoMutation.track())
      .subscribe(console.log);
  }
}
