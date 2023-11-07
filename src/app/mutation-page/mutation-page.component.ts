import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectIsMutating } from '@ngneat/query';

import { FormsModule } from '@angular/forms';
import { TodosService } from '../services/todos.service';
@Component({
  selector: 'query-mutation-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mutation-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MutationPageComponent {
  private useIsMutating = injectIsMutating();
  private todoService = inject(TodosService);

  public addTodoMutationsActive = this.useIsMutating().toSignal();

  public addTodo = this.todoService.addTodo();
  public addTodoSignalResult = this.addTodo.result;
  public newTodo = '';

  public onAddTodo(title: string) {
    this.addTodo.mutate({ title, showError: false });
  }

  public onAddTodoWithError(title: string) {
    this.addTodo.mutate({ title, showError: true });
  }

  public onResetMutation() {
    this.addTodo.reset();
  }
}
