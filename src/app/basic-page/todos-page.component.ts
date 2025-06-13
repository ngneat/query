import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosService } from '../services/todos.service';

@Component({
  selector: 'query-todos-page',
  imports: [CommonModule],
  templateUrl: './todos-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosPageComponent {
  #todosService = inject(TodosService);

  todosResult = this.#todosService.getTodos();
  todos = this.todosResult.result;
  private injector = inject(Injector);
}
