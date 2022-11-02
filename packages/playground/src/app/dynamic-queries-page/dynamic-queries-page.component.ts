import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { TodosService } from '../todos.service';
import { SubscribeModule } from '@ngneat/subscribe';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'ng-query-dynamic-queries-page',
  standalone: true,
  imports: [NgIf, NgForOf, NgClass, SubscribeModule, SpinnerComponent],
  template: `
    <h2 class="mb-3">Dynamic queries</h2>

    <p>
      In this example we create multiple queries dynamically using RxJs. This
      behavior should mimic react-query's useQueries. Try selecting and
      unselecting todo id's.
    </p>

    <h4 class="mt-3">Select Todos</h4>

    <ng-container *subscribe="selectedTodoIds as selectedIds">
      <ng-container *ngFor="let todoId of TODO_IDS">
        <button
          type="button"
          class="btn mr-2"
          [ngClass]="selectedIds.includes(todoId) ? 'btn-info' : 'btn-light'"
          (click)="toggleSelectedTodoId(todoId)"
        >
          {{ todoId }}
        </button>
      </ng-container>

      <ul class="list-group mt-4" *subscribe="todos$ as todos">
        <li class="list-group-item" *ngFor="let todo of todos">
          <ng-query-spinner *ngIf="todo.isLoading"></ng-query-spinner>
          <span *ngIf="todo.isSuccess"
            >{{ todo.data.id }} - {{ todo.data.title }}</span
          >
        </li>
      </ul>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicQueriesPageComponent {
  TODO_IDS = [1, 2, 3, 4, 5, 6];
  selectedTodoIds = new BehaviorSubject<number[]>([1, 3, 5]);

  todos$ = this.selectedTodoIds
    .asObservable()
    .pipe(
      switchMap((ids) =>
        combineLatest(ids.map((id) => this.todosService.getTodo(id).result$))
      )
    );

  constructor(private todosService: TodosService) {}

  toggleSelectedTodoId(todoId: number) {
    const currentIds = this.selectedTodoIds.getValue();

    if (currentIds.includes(todoId)) {
      this.selectedTodoIds.next(currentIds.filter((id) => id !== todoId));
    } else {
      this.selectedTodoIds.next([...currentIds, todoId]);
    }
  }
}
