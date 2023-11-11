import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosService } from '../services/todos.service';
import { intersectResults } from '@ngneat/query';

@Component({
  selector: 'query-todos-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosPageComponent {
  #todosService = inject(TodosService);
  #injector = inject(Injector);

  todosResult = this.#todosService.getTodos();
  todos = this.todosResult.result;

  intersection = intersectResults(
    [
      this.#todosService.getTodo('1').result,
      this.#todosService.getTodo('2').result,
    ],
    ([todoOne, todoTwo]) => {
      return todoOne.title + todoTwo.title;
    }
  );
}
