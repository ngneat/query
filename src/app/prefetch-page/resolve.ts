import { ResolveFn } from '@angular/router';
import { injectQueryClient } from '@ngneat/query';
import { Todo, getTodosQuery } from '../services/todos.service';

export const resolveTodos: ResolveFn<Todo[]> = async () => {
  const client = injectQueryClient();
  const query = getTodosQuery();

  return await client.ensureQueryData(query);
};
