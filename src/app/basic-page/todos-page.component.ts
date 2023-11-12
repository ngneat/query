import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosService } from '../services/todos.service';
import { TabsComponent } from '../ui/query-tabs/tabs.component';
import { TabComponent } from '../ui/query-tab/tab.component';

@Component({
  selector: 'query-todos-page',
  standalone: true,
  imports: [CommonModule, TabsComponent, TabComponent],
  templateUrl: './todos-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosPageComponent {
  #todosService = inject(TodosService);

  todosResult = this.#todosService.getTodos();
  todos = this.todosResult.result;
}
