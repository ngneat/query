import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosService } from '../services/todos.service';
import { intersectResults, intersectResults$ } from '@ngneat/query';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'query-intersecting-page',
    imports: [CommonModule],
    templateUrl: './intersecting-page.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntersectingPageComponent {
  #todosService = inject(TodosService);

  todosResult = this.#todosService.getTodos();
  todos = this.todosResult.result;

  intersection = intersectResults(
    [
      this.#todosService.getTodo('1').result,
      this.#todosService.getTodo('2').result,
    ],
    ([todoOne, todoTwo]) => {
      return todoOne.title + todoTwo.title;
    },
  );

  intersection$ = combineLatest({
    todoOne: this.#todosService.getTodo('1').result$,
    todoTwo: this.#todosService.getTodo('2').result$,
  }).pipe(
    intersectResults$(({ todoOne, todoTwo }) => {
      return todoOne.title + todoTwo.title;
    }),
  );
}
