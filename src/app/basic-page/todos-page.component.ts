import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosService } from './todos.service';

@Component({
  selector: 'query-todos-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosPageComponent {
  todos$ = inject(TodosService).getTodos().result$;
  todos = inject(TodosService).getTodos().toSignal();
}
