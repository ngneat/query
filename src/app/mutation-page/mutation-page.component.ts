import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectIsMutating, injectMutation } from '@ngneat/query';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

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
  private useMutation = injectMutation();
  private httpClient = inject(HttpClient);

  public addTodoMutationsActive = this.useIsMutating({mutationKey: ['addTodo']}).toSignal();

  public addTodo = this.useMutation({
    mutationFn: ({title, showError}: {title: string, showError: boolean}) => {
      const url = showError ? 'https://jsonplaceholder.typicode.com/error/404' : 'https://jsonplaceholder.typicode.com/todos';
      return this.httpClient.post<Todo>(url, {
        title,
      });
    },
    mutationKey: ['addTodo'],
  });

  newTitle = '';

  public addTodoSignalResult = this.addTodo.toSignal();
  public addTodoObservableResult = this.addTodo.result$;

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
