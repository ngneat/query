import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { createAsyncStore } from '@ngneat/query';
import { SubscribeModule } from '@ngneat/subscribe';
import { BehaviorSubject, exhaustMap, Subject, switchMap } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { TodosService } from '../todos.service';

@Component({
  selector: 'ng-query-basic-page',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, SubscribeModule],
  template: `
    <h2 class="mb-3">Todos</h2>

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

    <hr />
    <h2 class="mt-3">Mutation</h2>

    <button
      (click)="addTodo()"
      id="add-todo-1"
      class="btn btn-info mt-2"
      *subscribe="addTodoMutation$ as addTodoMutation"
    >
      Add todo {{ addTodoMutation.isLoading ? 'Loading' : '' }}
    </button>

    <button
      (click)="addTodo2()"
      id="add-todo-2"
      class="btn btn-info mt-2 ml-3"
      *subscribe="addTodoMutation.value$ as addTodoMutation"
    >
      Add todo v2 {{ addTodoMutation.isLoading ? 'Loading' : '' }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicPageComponent implements OnDestroy {
  private todosService = inject(TodosService);
  todo = new BehaviorSubject<number>(100);
  todos$ = this.todosService.getTodos().result$;
  todo$ = this.todo
    .asObservable()
    .pipe(switchMap((id) => this.todosService.getTodo(id).result$));

  clickAddTodo$ = new Subject();
  clickAddTodo2$ = new Subject();

  addTodoMutation$ = this.todosService.addTodo();
  addTodoMutation = createAsyncStore();

  constructor() {
    this.clickAddTodo$
      .pipe(exhaustMap(() => this.addTodoMutation$.mutate({ title: 'foo' })))
      .subscribe(console.log);

    this.clickAddTodo2$
      .pipe(
        exhaustMap(() =>
          this.todosService
            .addTodo2({ title: 'foo' })
            .pipe(this.addTodoMutation.track())
        )
      )
      .subscribe(console.log);
  }

  addTodo() {
    this.clickAddTodo$.next(true);
  }

  addTodo2() {
    this.clickAddTodo2$.next(true);
  }

  ngOnDestroy(): void {
      this.clickAddTodo$.unsubscribe();
      this.clickAddTodo2$.unsubscribe();
  }
}
