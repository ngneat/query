import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectIsMutating } from '@ngneat/query';

import { FormsModule } from '@angular/forms';
import { TodosService } from '../services/todos.service';
import { TabsComponent } from '../ui/query-tabs/tabs.component';
import { TabComponent } from '../ui/query-tab/tab.component';
@Component({
  selector: 'query-mutation-page',
  standalone: true,
  imports: [CommonModule, FormsModule, TabsComponent, TabComponent],
  templateUrl: './mutation-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MutationPageComponent {
  #useIsMutating = injectIsMutating();
  #todoService = inject(TodosService);

  public addTodoMutationsActive = this.#useIsMutating().toSignal();

  public addTodo = this.#todoService.addTodo();
  public addTodoSignalResult = this.addTodo.result;
  public newTodo = '';

  public onAddTodo(title: string) {
    this.addTodo.mutate(
      { title, showError: false },
      {
        onSuccess: () => {
          console.log('onSuccess');
        },
      },
    );
    this.newTodo = '';
  }

  public onAddTodoWithError(title: string) {
    this.addTodo.mutate({ title, showError: true });
    this.newTodo = '';
  }

  public onResetMutation() {
    this.addTodo.reset();
    this.newTodo = '';
  }
}
