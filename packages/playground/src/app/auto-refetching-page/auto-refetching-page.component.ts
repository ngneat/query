import { animate, style, transition, trigger } from '@angular/animations';
import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SubscribeModule } from '@ngneat/subscribe';
import { BehaviorSubject, switchMap } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { TodosService } from '../todos.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ng-query-auto-refetching',
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    JsonPipe,
    SubscribeModule,
    FormsModule,
    SpinnerComponent,
  ],
  template: `<div>
    <div class="mb-4 w-96">
      <label class="block text-gray-700 text-sm font-bold mb-1" for="username">
        Query Interval speed (ms)
      </label>
      <input
        type="number"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        step="100"
        [(ngModel)]="interval"
      />
    </div>
    <div class="relative">
      <h2>Todo list</h2>
      <ng-container *subscribe="todos$ as todos">
        <div
          class="flex items-center gap-4 absolute right-0 top-0"
          *ngIf="todos.isFetching"
          @myInsertRemoveTrigger
        >
          <ng-query-spinner></ng-query-spinner>
          <span>Refetching</span>
        </div>

        <ul class="list-group" *ngIf="todos.isSuccess">
          <li class="list-group-item" *ngFor="let todo of todos.data">
            {{ todo.title }}
          </li>
        </ul>
      </ng-container>
    </div>
  </div>`,
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('50ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('100ms 1000ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class AutoRefetchingPageComponent {
  private todosService = inject(TodosService);
  private intervalSubject = new BehaviorSubject(3000);
  interval$ = this.intervalSubject.asObservable();

  todos$ = this.interval$.pipe(
    switchMap(
      (interval) =>
        this.todosService.getTodosWithOptions({ refetchInterval: interval })
          .result$
    )
  );

  set interval(value: number) {
    this.intervalSubject.next(value);
  }

  get interval() {
    return this.intervalSubject.getValue();
  }
}
